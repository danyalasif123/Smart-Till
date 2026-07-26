import crypto from "crypto";

import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import StockTransaction from "../models/StockTransaction.js";


// ==========================================
// GENERATE PURCHASE NUMBER
// Example: PUR-A82F19C4
// ==========================================

const generatePurchaseNumber = () => {
  const code = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `PUR-${code}`;
};


// ==========================================
// CREATE PURCHASE
// POST /api/purchases
//
// IMPORTANT:
// Creating purchase DOES NOT increase stock.
// Stock increases only when purchase is received.
// ==========================================

export const createPurchase = async (
  req,
  res
) => {
  try {
    const {
      supplierId,
      items,
      discount = 0,
      tax = 0,
      supplierReference = "",
      notes = "",
    } = req.body;


    // ======================================
    // VALIDATE SUPPLIER
    // ======================================

    if (!supplierId) {
      return res.status(400).json({
        message:
          "Supplier is required",
      });
    }


    const supplier =
      await Supplier.findOne({
        _id: supplierId,

        businessId:
          req.user.businessId,

        status: true,
      });


    if (!supplier) {
      return res.status(404).json({
        message:
          "Supplier not found or inactive",
      });
    }


    // ======================================
    // VALIDATE ITEMS
    // ======================================

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message:
          "Purchase must contain at least one product",
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
    // PREPARE PURCHASE ITEMS
    // ======================================

    const purchaseItems = [];

    let subtotal = 0;

    const seenProducts =
      new Set();


    // ======================================
    // PROCESS ITEMS
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


      // Prevent same product appearing twice
      if (
        seenProducts.has(
          item.productId.toString()
        )
      ) {
        return res.status(400).json({
          message:
            "The same product cannot be added twice to a purchase",
        });
      }

      seenProducts.add(
        item.productId.toString()
      );


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
      // UNIT COST
      // ====================================

      const unitCost =
        Number(item.unitCost);

      if (
        Number.isNaN(unitCost) ||
        unitCost < 0
      ) {
        return res.status(400).json({
          message:
            "Unit cost must be a valid positive number",
        });
      }


      // ====================================
      // FIND PRODUCT
      //
      // Must belong to same business.
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
      // ITEM SUBTOTAL
      // ====================================

      const itemSubtotal =
        unitCost * quantity;


      subtotal +=
        itemSubtotal;


      // ====================================
      // PURCHASE SNAPSHOT
      // ====================================

      purchaseItems.push({
        productId:
          product._id,

        productName:
          product.name,

        sku:
          product.sku || "",

        quantity,

        unitCost,

        subtotal:
          itemSubtotal,
      });
    }


    // ======================================
    // CALCULATE TOTAL
    // ======================================

    const total =
      subtotal -
      cleanDiscount +
      cleanTax;


    if (total < 0) {
      return res.status(400).json({
        message:
          "Discount cannot be greater than purchase amount",
      });
    }


    // ======================================
    // GENERATE PURCHASE NUMBER
    // ======================================

    let purchaseNumber;

    let exists = true;

    while (exists) {
      purchaseNumber =
        generatePurchaseNumber();

      exists =
        await Purchase.exists({
          purchaseNumber,
        });
    }


    // ======================================
    // CREATE PURCHASE
    //
    // IMPORTANT:
    // NO PRODUCT STOCK CHANGES HERE.
    // ======================================

    const purchase =
      await Purchase.create({
        purchaseNumber,

        supplierId:
          supplier._id,

        items:
          purchaseItems,

        subtotal,

        discount:
          cleanDiscount,

        tax:
          cleanTax,

        total,

        supplierReference:
          supplierReference?.trim() || "",

        status:
          "pending",

        paymentStatus:
          "unpaid",

        amountPaid:
          0,

        notes:
          notes?.trim() || "",

        receivedAt:
          null,

        receivedBy:
          null,

        businessId:
          req.user.businessId,

        createdBy:
          req.user.id,
      });


    // ======================================
    // POPULATE
    // ======================================

    const populatedPurchase =
      await Purchase.findById(
        purchase._id
      )
        .populate(
          "supplierId",
          "name contactPerson phone email"
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
        "Purchase created successfully",

      purchase:
        populatedPurchase,
    });

  } catch (error) {
    console.error(
      "Create Purchase Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ==========================================
// GET ALL PURCHASES
// GET /api/purchases
// ==========================================

export const getPurchases = async (
  req,
  res
) => {
  try {

    const purchases =
      await Purchase.find({
        businessId:
          req.user.businessId,
      })
        .populate(
          "supplierId",
          "name contactPerson phone email"
        )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "receivedBy",
          "name email role"
        )
        .select("-__v")
        .sort({
          createdAt: -1,
        });


    res.status(200).json({
      count:
        purchases.length,

      purchases,
    });

  } catch (error) {
    console.error(
      "Get Purchases Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ==========================================
// GET PURCHASE BY ID
// GET /api/purchases/:id
// ==========================================

export const getPurchaseById = async (
  req,
  res
) => {
  try {

    const purchase =
      await Purchase.findOne({
        _id:
          req.params.id,

        businessId:
          req.user.businessId,
      })
        .populate(
          "supplierId",
          "name contactPerson phone email address city postcode country"
        )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "receivedBy",
          "name email role"
        )
        .select("-__v");


    if (!purchase) {
      return res.status(404).json({
        message:
          "Purchase not found",
      });
    }


    res.status(200).json({
      purchase,
    });

  } catch (error) {
    console.error(
      "Get Purchase Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ==========================================
// RECEIVE PURCHASE
//
// PATCH /api/purchases/:id/receive
//
// THIS IS WHERE INVENTORY CHANGES.
// ==========================================

export const receivePurchase = async (
  req,
  res
) => {
  try {

    // ======================================
    // FIND PURCHASE
    // ======================================

    const purchase =
      await Purchase.findOne({
        _id:
          req.params.id,

        businessId:
          req.user.businessId,
      });


    if (!purchase) {
      return res.status(404).json({
        message:
          "Purchase not found",
      });
    }


    // ======================================
    // ALREADY RECEIVED
    //
    // Critical because otherwise clicking
    // Receive twice would duplicate stock.
    // ======================================

    if (
      purchase.status ===
      "received"
    ) {
      return res.status(400).json({
        message:
          "Purchase has already been received",
      });
    }


    // ======================================
    // CANCELLED PURCHASE
    // ======================================

    if (
      purchase.status ===
      "cancelled"
    ) {
      return res.status(400).json({
        message:
          "Cancelled purchase cannot be received",
      });
    }


    // ======================================
    // PROCESS PURCHASE ITEMS
    // ======================================

    for (
      const item of purchase.items
    ) {

      // ====================================
      // FIND PRODUCT
      // ====================================

      const product =
        await Product.findOne({
          _id:
            item.productId,

          businessId:
            req.user.businessId,
        });


      if (!product) {
        return res.status(404).json({
          message:
            `Product "${item.productName}" no longer exists`,
        });
      }


      // ====================================
      // STOCK BEFORE
      // ====================================

      const stockBefore =
        Number(
          product.stockQuantity || 0
        );


      // ====================================
      // QUANTITY RECEIVED
      // ====================================

      const quantity =
        Number(item.quantity);


      // ====================================
      // STOCK AFTER
      // ====================================

      const stockAfter =
        stockBefore +
        quantity;


      // ====================================
      // UPDATE PRODUCT STOCK
      // ====================================

      product.stockQuantity =
        stockAfter;


      // ====================================
      // UPDATE PRODUCT COST PRICE
      //
      // Latest supplier cost becomes the
      // current product cost price.
      // ====================================

      product.costPrice =
        Number(item.unitCost);


      await product.save();


      // ====================================
      // CREATE STOCK TRANSACTION
      // ====================================

      await StockTransaction.create({
        productId:
          product._id,

        type:
          "purchase",

        quantity,

        stockBefore,

        stockAfter,

        reference:
          purchase.purchaseNumber,

        notes:
          `Stock received from purchase ${purchase.purchaseNumber}`,

        businessId:
          req.user.businessId,

        createdBy:
          req.user.id,
      });
    }


    // ======================================
    // MARK PURCHASE RECEIVED
    // ======================================

    purchase.status =
      "received";

    purchase.receivedAt =
      new Date();

    purchase.receivedBy =
      req.user.id;


    await purchase.save();


    // ======================================
    // POPULATE RESPONSE
    // ======================================

    const populatedPurchase =
      await Purchase.findById(
        purchase._id
      )
        .populate(
          "supplierId",
          "name contactPerson phone email"
        )
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "receivedBy",
          "name email role"
        );


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      message:
        "Purchase received and inventory updated successfully",

      purchase:
        populatedPurchase,
    });

  } catch (error) {
    console.error(
      "Receive Purchase Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ==========================================
// CANCEL PURCHASE
//
// PATCH /api/purchases/:id/cancel
//
// Only pending purchases can be cancelled.
// ==========================================

export const cancelPurchase = async (
  req,
  res
) => {
  try {

    const purchase =
      await Purchase.findOne({
        _id:
          req.params.id,

        businessId:
          req.user.businessId,
      });


    if (!purchase) {
      return res.status(404).json({
        message:
          "Purchase not found",
      });
    }


    // ======================================
    // ALREADY RECEIVED
    // ======================================

    if (
      purchase.status ===
      "received"
    ) {
      return res.status(400).json({
        message:
          "Received purchase cannot be cancelled",
      });
    }


    // ======================================
    // ALREADY CANCELLED
    // ======================================

    if (
      purchase.status ===
      "cancelled"
    ) {
      return res.status(400).json({
        message:
          "Purchase is already cancelled",
      });
    }


    // ======================================
    // CANCEL
    // ======================================

    purchase.status =
      "cancelled";


    await purchase.save();


    res.status(200).json({
      message:
        "Purchase cancelled successfully",

      purchase,
    });

  } catch (error) {
    console.error(
      "Cancel Purchase Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};
// ==========================================
// RECORD PURCHASE PAYMENT
//
// PATCH /api/purchases/:id/payment
//
// Examples:
//
// Total:      500
// AmountPaid: 0
//
// Payment: 200
// AmountPaid becomes 200
// Status becomes "partial"
//
// Payment: 300
// AmountPaid becomes 500
// Status becomes "paid"
// ==========================================

export const recordPurchasePayment = async (
  req,
  res
) => {
  try {
    const { amount } = req.body;


    // ======================================
    // VALIDATE AMOUNT
    // ======================================

    const paymentAmount =
      Number(amount);

    if (
      Number.isNaN(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return res.status(400).json({
        message:
          "Payment amount must be greater than 0",
      });
    }


    // ======================================
    // FIND PURCHASE
    // ======================================

    const purchase =
      await Purchase.findOne({
        _id: req.params.id,

        businessId:
          req.user.businessId,
      });


    if (!purchase) {
      return res.status(404).json({
        message:
          "Purchase not found",
      });
    }


    // ======================================
    // CANCELLED PURCHASE
    // ======================================

    if (
      purchase.status ===
      "cancelled"
    ) {
      return res.status(400).json({
        message:
          "Cannot record payment for a cancelled purchase",
      });
    }


    // ======================================
    // CURRENT VALUES
    // ======================================

    const total =
      Number(purchase.total || 0);

    const currentPaid =
      Number(
        purchase.amountPaid || 0
      );

    const outstandingBalance =
      total - currentPaid;


    // ======================================
    // ALREADY PAID
    // ======================================

    if (
      outstandingBalance <= 0
    ) {
      return res.status(400).json({
        message:
          "Purchase has already been fully paid",
      });
    }


    // ======================================
    // PREVENT OVERPAYMENT
    // ======================================

    if (
      paymentAmount >
      outstandingBalance
    ) {
      return res.status(400).json({
        message:
          `Payment cannot exceed outstanding balance of $${outstandingBalance.toFixed(
            2
          )}`,
      });
    }


    // ======================================
    // UPDATE AMOUNT PAID
    // ======================================

    purchase.amountPaid =
      currentPaid +
      paymentAmount;


    // ======================================
    // DETERMINE PAYMENT STATUS
    // ======================================

    if (
      purchase.amountPaid >=
      total
    ) {
      purchase.paymentStatus =
        "paid";
    } else if (
      purchase.amountPaid > 0
    ) {
      purchase.paymentStatus =
        "partial";
    } else {
      purchase.paymentStatus =
        "unpaid";
    }


    // ======================================
    // SAVE
    // ======================================

    await purchase.save();


    // ======================================
    // RESPONSE
    // ======================================

    res.status(200).json({
      message:
        "Purchase payment recorded successfully",

      payment: {
        paymentAmount,

        total,

        amountPaid:
          purchase.amountPaid,

        balance:
          total -
          purchase.amountPaid,

        paymentStatus:
          purchase.paymentStatus,
      },

      purchase,
    });

  } catch (error) {
    console.error(
      "Purchase Payment Error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};