import crypto from "crypto";

import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";
import StockTransaction from "../models/StockTransaction.js";


// ==========================================
// GENERATE SALE NUMBER
// Example: SALE-A82F19C4
// ==========================================

const generateSaleNumber = () => {
  const code = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `SALE-${code}`;
};


// ==========================================
// CREATE SALE
// POST /api/sales
// ==========================================

export const createSale = async (req, res) => {
  try {
    const {
      customerId,
      items,
      paymentMethod,
      discount = 0,
      tax = 0,
      notes = "",
      source = "pos",
      externalOrderId = "",
    } = req.body;


    // ======================================
    // VALIDATE ITEMS
    // ======================================

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message:
          "Sale must contain at least one product",
      });
    }


    // ======================================
    // VALIDATE SOURCE
    // ======================================

    const allowedSources = [
      "pos",
      "online",
    ];

    if (!allowedSources.includes(source)) {
      return res.status(400).json({
        message: "Invalid sale source",
      });
    }


    // ======================================
    // VALIDATE PAYMENT METHOD
    // ======================================

    const allowedPaymentMethods = [
      "cash",
      "card",
      "online",
      "other",
    ];

    if (
      !paymentMethod ||
      !allowedPaymentMethods.includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid payment method",
      });
    }


    // ======================================
    // VALIDATE DISCOUNT
    // ======================================

    const cleanDiscount =
      Number(discount);

    if (
      Number.isNaN(cleanDiscount) ||
      cleanDiscount < 0
    ) {
      return res.status(400).json({
        message:
          "Discount must be a valid positive number",
      });
    }


    // ======================================
    // VALIDATE TAX
    // ======================================

    const cleanTax =
      Number(tax);

    if (
      Number.isNaN(cleanTax) ||
      cleanTax < 0
    ) {
      return res.status(400).json({
        message:
          "Tax must be a valid positive number",
      });
    }


    // ======================================
    // VALIDATE CUSTOMER
    //
    // customerId is optional.
    // null = anonymous walk-in customer.
    // ======================================

    let customer = null;

    if (customerId) {
      customer =
        await Customer.findOne({
          _id: customerId,

          businessId:
            req.user.businessId,

          status: true,
        });

      if (!customer) {
        return res.status(404).json({
          message:
            "Customer not found or inactive",
        });
      }
    }


    // ======================================
    // CHECK ONLINE ORDER DUPLICATE
    // ======================================

    const cleanExternalOrderId =
      externalOrderId?.trim() || "";

    if (
      source === "online" &&
      cleanExternalOrderId
    ) {
      const existingOnlineSale =
        await Sale.findOne({
          businessId:
            req.user.businessId,

          externalOrderId:
            cleanExternalOrderId,
        });

      if (existingOnlineSale) {
        return res.status(400).json({
          message:
            "This online order has already been imported",
        });
      }
    }


    // ======================================
    // PREPARE SALE DATA
    // ======================================

    const saleItems = [];

    const stockUpdates = [];

    let subtotal = 0;


    // ======================================
    // PROCESS PRODUCTS
    // ======================================

    for (const item of items) {

      // ====================================
      // PRODUCT ID
      // ====================================

      if (!item.productId) {
        return res.status(400).json({
          message:
            "Product ID is required",
        });
      }


      // ====================================
      // QUANTITY
      // ====================================

      const quantity =
        Number(item.quantity);

      if (
        Number.isNaN(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          message:
            "Quantity must be greater than 0",
        });
      }


      // ====================================
      // GET PRODUCT
      // ====================================

      const product =
        await Product.findOne({
          _id: item.productId,

          businessId:
            req.user.businessId,

          status: true,
        });

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found or inactive",
        });
      }


      // ====================================
      // SELLING PRICE
      // ====================================

      const sellingPrice =
        Number(
          product.sellingPrice
        );

      if (
        Number.isNaN(sellingPrice) ||
        sellingPrice < 0
      ) {
        return res.status(400).json({
          message:
            `Invalid selling price for ${product.name}`,
        });
      }


      // ====================================
      // CURRENT STOCK
      // ====================================

      const currentStock =
        Number(
          product.stockQuantity
        );

      if (
        Number.isNaN(currentStock) ||
        currentStock < 0
      ) {
        return res.status(400).json({
          message:
            `Invalid stock quantity for ${product.name}`,
        });
      }


      // ====================================
      // CHECK AVAILABLE STOCK
      // ====================================

      if (currentStock < quantity) {
        return res.status(400).json({
          message:
            `Insufficient stock for ${product.name}. Available: ${currentStock}`,
        });
      }


      // ====================================
      // ITEM SUBTOTAL
      // ====================================

      const itemSubtotal =
        sellingPrice * quantity;

      subtotal +=
        itemSubtotal;


      // ====================================
      // PRODUCT SNAPSHOT
      //
      // Keeps old receipts correct even
      // if product information changes.
      // ====================================

      saleItems.push({
        productId:
          product._id,

        productName:
          product.name,

        sku:
          product.sku || "",

        barcode:
          product.barcode || "",

        unit:
          product.unit || "",

        unitPrice:
          sellingPrice,

        quantity,

        subtotal:
          itemSubtotal,
      });


      // ====================================
      // PREPARE STOCK UPDATE
      //
      // We save stockBefore here so that
      // inventory history can show:
      //
      // 20 -> sold 3 -> 17
      // ====================================

      stockUpdates.push({
        product,
        quantity,

        stockBefore:
          currentStock,

        stockAfter:
          currentStock -
          quantity,
      });
    }


    // ======================================
    // CALCULATE FINAL TOTAL
    // ======================================

    const total =
      subtotal -
      cleanDiscount +
      cleanTax;


    // ======================================
    // VALIDATE TOTAL
    // ======================================

    if (total < 0) {
      return res.status(400).json({
        message:
          "Discount cannot be greater than the sale amount",
      });
    }


    // ======================================
    // GENERATE UNIQUE SALE NUMBER
    // ======================================

    let saleNumber;

    let saleNumberExists = true;

    while (saleNumberExists) {
      saleNumber =
        generateSaleNumber();

      saleNumberExists =
        await Sale.exists({
          saleNumber,
        });
    }


    // ======================================
    // CREATE SALE
    // ======================================

    const sale =
      await Sale.create({
        saleNumber,

        source,

        customerId:
          customer
            ? customer._id
            : null,

        // POS sale has cashier.
        // Online sale does not require one.
        cashierId:
          source === "pos"
            ? req.user.id
            : null,

        items:
          saleItems,

        subtotal,

        discount:
          cleanDiscount,

        tax:
          cleanTax,

        total,

        paymentMethod,

        paymentStatus:
          "paid",

        status:
          "completed",

        externalOrderId:
          cleanExternalOrderId,

        notes:
          notes?.trim() || "",

        businessId:
          req.user.businessId,

        createdBy:
          req.user.id,
      });


    // ======================================
    // REDUCE PRODUCT STOCK
    //
    // AND
    //
    // CREATE STOCK TRANSACTION
    // ======================================

    for (const stockItem of stockUpdates) {

      const {
        product,
        quantity,
        stockBefore,
        stockAfter,
      } = stockItem;


      // ====================================
      // UPDATE PRODUCT STOCK
      // ====================================

      product.stockQuantity =
        stockAfter;

      await product.save();


      // ====================================
      // CREATE INVENTORY HISTORY
      // ====================================

      await StockTransaction.create({
        businessId:
          req.user.businessId,

        productId:
          product._id,

        type:
          "sale",

        // Negative because stock
        // leaves inventory.
        quantity:
          -quantity,

        stockBefore,

        stockAfter,

        // Human-readable reference
        reference:
          sale.saleNumber,

        // Actual Sale MongoDB ID
        referenceId:
          sale._id,

        notes:
          `Stock reduced by sale ${sale.saleNumber}`,

        createdBy:
          req.user.id,
      });
    }


    // ======================================
    // UPDATE CUSTOMER STATISTICS
    // ======================================

    if (customer) {

      customer.totalOrders +=
        1;

      customer.totalSpent +=
        total;

      customer.lastPurchaseAt =
        new Date();

      await customer.save();
    }


    // ======================================
    // POPULATE SALE
    // ======================================

    const populatedSale =
      await Sale.findById(
        sale._id
      )
        .populate(
          "customerId",
          "customerNumber name phone email totalOrders totalSpent lastPurchaseAt"
        )
        .populate(
          "cashierId",
          "name email role"
        )
        .populate(
          "createdBy",
          "name email role"
        );


    // ======================================
    // RESPONSE
    // ======================================

    res.status(201).json({
      message:
        "Sale completed successfully",

      sale:
        populatedSale,
    });

  } catch (error) {

    console.error(
      "Create Sale Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ==========================================
// GET ALL SALES
// GET /api/sales
// ==========================================

export const getSales = async (
  req,
  res
) => {
  try {

    const sales =
      await Sale.find({
        businessId:
          req.user.businessId,
      })
        .populate(
          "customerId",
          "customerNumber name phone email"
        )
        .populate(
          "cashierId",
          "name email role"
        )
        .select("-__v")
        .sort({
          createdAt: -1,
        });


    res.status(200).json({
      count:
        sales.length,

      sales,
    });

  } catch (error) {

    console.error(
      "Get Sales Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ==========================================
// GET SALE BY ID
// GET /api/sales/:id
// ==========================================

export const getSaleById = async (
  req,
  res
) => {
  try {

    const sale =
      await Sale.findOne({
        _id:
          req.params.id,

        businessId:
          req.user.businessId,
      })
        .populate(
          "customerId",
          "customerNumber name phone email totalOrders totalSpent lastPurchaseAt"
        )
        .populate(
          "cashierId",
          "name email role"
        )
        .populate(
          "createdBy",
          "name email role"
        )
        .select("-__v");


    // ======================================
    // SALE NOT FOUND
    // ======================================

    if (!sale) {
      return res.status(404).json({
        message:
          "Sale not found",
      });
    }


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      sale,
    });

  } catch (error) {

    console.error(
      "Get Sale Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ==========================================
// GET CUSTOMER SALES
//
// GET /api/sales/customer/:customerId
// ==========================================

export const getCustomerSales = async (
  req,
  res
) => {
  try {

    // ======================================
    // FIND CUSTOMER
    // ======================================

    const customer =
      await Customer.findOne({
        _id:
          req.params.customerId,

        businessId:
          req.user.businessId,
      });


    // ======================================
    // CUSTOMER NOT FOUND
    // ======================================

    if (!customer) {
      return res.status(404).json({
        message:
          "Customer not found",
      });
    }


    // ======================================
    // GET CUSTOMER SALES
    // ======================================

    const sales =
      await Sale.find({
        businessId:
          req.user.businessId,

        customerId:
          customer._id,

        status:
          "completed",
      })
        .populate(
          "cashierId",
          "name email role"
        )
        .select("-__v")
        .sort({
          createdAt: -1,
        });


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({

      customer: {
        _id:
          customer._id,

        customerNumber:
          customer.customerNumber,

        name:
          customer.name,

        phone:
          customer.phone,

        email:
          customer.email,

        totalOrders:
          customer.totalOrders,

        totalSpent:
          customer.totalSpent,

        lastPurchaseAt:
          customer.lastPurchaseAt,

        customerType:
          customer.customerType,
      },

      count:
        sales.length,

      sales,
    });

  } catch (error) {

    console.error(
      "Get Customer Sales Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};