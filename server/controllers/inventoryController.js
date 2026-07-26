import Product from "../models/Product.js";
import StockTransaction from "../models/StockTransaction.js";


// ==========================================
// GET INVENTORY
// GET /api/inventory
// ==========================================

export const getInventory = async (req, res) => {
  try {
    const products = await Product.find({
      businessId: req.user.businessId,
    })
      .populate(
        "categoryId",
        "name"
      )
      .select(
        "name sku barcode categoryId stockQuantity lowStockLevel unit status sellingPrice costPrice"
      )
      .sort({
        name: 1,
      });

    res.status(200).json({
      count: products.length,
      products,
    });

  } catch (error) {
    console.error(
      "Get Inventory Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET LOW STOCK PRODUCTS
// GET /api/inventory/low-stock
// ==========================================

export const getLowStockProducts = async (
  req,
  res
) => {
  try {
    /*
      MongoDB $expr lets us compare
      two fields from the same document:

      stockQuantity <= lowStockLevel
    */

    const products = await Product.find({
      businessId: req.user.businessId,

      status: true,

      $expr: {
        $lte: [
          "$stockQuantity",
          "$lowStockLevel",
        ],
      },
    })
      .populate(
        "categoryId",
        "name"
      )
      .select(
        "name sku barcode stockQuantity lowStockLevel unit categoryId"
      )
      .sort({
        stockQuantity: 1,
      });

    res.status(200).json({
      count: products.length,
      products,
    });

  } catch (error) {
    console.error(
      "Get Low Stock Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL STOCK TRANSACTIONS
// GET /api/inventory/transactions
// ==========================================

export const getStockTransactions = async (
  req,
  res
) => {
  try {
    const transactions =
      await StockTransaction.find({
        businessId:
          req.user.businessId,
      })
        .populate(
          "productId",
          "name sku barcode unit"
        )
        .populate(
          "createdBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      count: transactions.length,
      transactions,
    });

  } catch (error) {
    console.error(
      "Get Stock Transactions Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET PRODUCT STOCK HISTORY
// GET /api/inventory/product/:productId
// ==========================================

export const getProductStockHistory = async (
  req,
  res
) => {
  try {
    // ======================================
    // CHECK PRODUCT
    // ======================================

    const product = await Product.findOne({
      _id: req.params.productId,

      businessId:
        req.user.businessId,
    })
      .populate(
        "categoryId",
        "name"
      )
      .select("-__v");

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    // ======================================
    // GET HISTORY
    // ======================================

    const transactions =
      await StockTransaction.find({
        businessId:
          req.user.businessId,

        productId:
          product._id,
      })
        .populate(
          "createdBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      product,

      count:
        transactions.length,

      transactions,
    });

  } catch (error) {
    console.error(
      "Get Product Stock History Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// MANUAL STOCK ADJUSTMENT
// POST /api/inventory/adjust
//
// Body:
//
// {
//   "productId": "...",
//   "quantity": 10,
//   "type": "purchase",
//   "reference": "DELIVERY-001",
//   "notes": "New stock received"
// }
//
// Positive quantity:
// +10
//
// Negative quantity:
// -2
// ==========================================

export const adjustStock = async (
  req,
  res
) => {
  try {
    const {
      productId,
      quantity,
      type,
      reference,
      notes,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (!productId) {
      return res.status(400).json({
        message:
          "Product is required",
      });
    }

    if (
      quantity === undefined ||
      quantity === null ||
      Number(quantity) === 0 ||
      Number.isNaN(Number(quantity))
    ) {
      return res.status(400).json({
        message:
          "Quantity must be a non-zero number",
      });
    }

    const allowedTypes = [
      "purchase",
      "adjustment",
      "damage",
      "return",
      "opening",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message:
          "Invalid stock transaction type",
      });
    }

    // ======================================
    // FIND PRODUCT
    // ======================================

    const product =
      await Product.findOne({
        _id: productId,

        businessId:
          req.user.businessId,
      });

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    // ======================================
    // NORMALIZE QUANTITY
    // ======================================

    let quantityChange =
      Number(quantity);

    /*
      Damage always removes stock.

      Therefore if frontend sends:

      quantity: 2
      type: damage

      Backend converts it to:

      -2
    */

    if (
      type === "damage" &&
      quantityChange > 0
    ) {
      quantityChange =
        -quantityChange;
    }

    /*
      Purchase/opening/return normally
      add stock.

      We force them positive so the
      frontend cannot accidentally send
      -20 for received stock.
    */

    if (
      [
        "purchase",
        "opening",
        "return",
      ].includes(type)
    ) {
      quantityChange =
        Math.abs(quantityChange);
    }

    // ======================================
    // CALCULATE STOCK
    // ======================================

    const stockBefore =
      Number(
        product.stockQuantity || 0
      );

    const stockAfter =
      stockBefore +
      quantityChange;

    // ======================================
    // PREVENT NEGATIVE STOCK
    // ======================================

    if (stockAfter < 0) {
      return res.status(400).json({
        message:
          `Insufficient stock. Current stock is ${stockBefore}.`,
      });
    }

    // ======================================
    // UPDATE PRODUCT
    // ======================================

    product.stockQuantity =
      stockAfter;

    await product.save();

    // ======================================
    // CREATE STOCK TRANSACTION
    // ======================================

    const transaction =
      await StockTransaction.create({
        businessId:
          req.user.businessId,

        productId:
          product._id,

        type,

        quantity:
          quantityChange,

        stockBefore,

        stockAfter,

        reference:
          reference?.trim() || "",

        notes:
          notes?.trim() || "",

        createdBy:
          req.user.id,
      });

    // ======================================
    // POPULATE RESPONSE
    // ======================================

    await transaction.populate(
      "productId",
      "name sku barcode unit"
    );

    await transaction.populate(
      "createdBy",
      "name email role"
    );

    res.status(201).json({
      message:
        "Stock updated successfully",

      product: {
        _id:
          product._id,

        name:
          product.name,

        stockQuantity:
          product.stockQuantity,

        unit:
          product.unit,
      },

      transaction,
    });

  } catch (error) {
    console.error(
      "Adjust Stock Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};