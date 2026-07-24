import Product from "../models/Product.js";
import Category from "../models/Category.js";


// ==========================================
// CREATE PRODUCT
// POST /api/products
// ==========================================

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      barcode,
      categoryId,
      costPrice,
      sellingPrice,
      stockQuantity,
      lowStockLevel,
      unit,
      taxRate,
      status,
    } = req.body;

    // ======================================
    // BASIC VALIDATION
    // ======================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (!categoryId) {
      return res.status(400).json({
        message: "Category is required",
      });
    }

    if (
      sellingPrice === undefined ||
      sellingPrice === null ||
      sellingPrice === ""
    ) {
      return res.status(400).json({
        message: "Selling price is required",
      });
    }

    if (Number(sellingPrice) < 0) {
      return res.status(400).json({
        message: "Selling price cannot be negative",
      });
    }

    // ======================================
    // CHECK CATEGORY
    // Category must belong to same business
    // ======================================

    const category = await Category.findOne({
      _id: categoryId,
      businessId: req.user.businessId,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (!category.status) {
      return res.status(400).json({
        message: "Cannot add product to an inactive category",
      });
    }

    // ======================================
    // CHECK SKU
    // ======================================

    if (sku && sku.trim()) {
      const existingSku = await Product.findOne({
        businessId: req.user.businessId,
        sku: sku.trim().toUpperCase(),
      });

      if (existingSku) {
        return res.status(400).json({
          message: "SKU already exists",
        });
      }
    }

    // ======================================
    // CHECK BARCODE
    // ======================================

    if (barcode && barcode.trim()) {
      const existingBarcode = await Product.findOne({
        businessId: req.user.businessId,
        barcode: barcode.trim(),
      });

      if (existingBarcode) {
        return res.status(400).json({
          message: "Barcode already exists",
        });
      }
    }

    // ======================================
    // CREATE PRODUCT
    // ======================================

    const product = await Product.create({
      name: name.trim(),

      sku:
        sku && sku.trim()
          ? sku.trim().toUpperCase()
          : undefined,

      barcode:
        barcode && barcode.trim()
          ? barcode.trim()
          : undefined,

      categoryId,

      costPrice:
        costPrice !== undefined && costPrice !== ""
          ? Number(costPrice)
          : 0,

      sellingPrice: Number(sellingPrice),

      stockQuantity:
        stockQuantity !== undefined && stockQuantity !== ""
          ? Number(stockQuantity)
          : 0,

      lowStockLevel:
        lowStockLevel !== undefined && lowStockLevel !== ""
          ? Number(lowStockLevel)
          : 5,

      unit:
        unit && unit.trim()
          ? unit.trim()
          : "piece",

      taxRate:
        taxRate !== undefined && taxRate !== ""
          ? Number(taxRate)
          : 0,

      status:
        typeof status === "boolean"
          ? status
          : true,

      businessId: req.user.businessId,

      createdBy: req.user.id,
    });

    // Populate category before returning
    await product.populate(
      "categoryId",
      "name status"
    );

    res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("Create Product Error:", error);

    // Handle duplicate index error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "SKU or barcode already exists",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL PRODUCTS
// GET /api/products
// ==========================================

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      businessId: req.user.businessId,
    })
      .populate(
        "categoryId",
        "name status"
      )
      .select("-__v")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// ==========================================

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    })
      .populate(
        "categoryId",
        "name status"
      )
      .populate(
        "createdBy",
        "name email"
      )
      .select("-__v");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });

  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ==========================================

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      barcode,
      categoryId,
      costPrice,
      sellingPrice,
      stockQuantity,
      lowStockLevel,
      unit,
      taxRate,
      status,
    } = req.body;

    // ======================================
    // FIND PRODUCT
    // ======================================

    const product = await Product.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ======================================
    // VALIDATE NAME
    // ======================================

    if (
      name !== undefined &&
      !name.trim()
    ) {
      return res.status(400).json({
        message: "Product name cannot be empty",
      });
    }

    // ======================================
    // VALIDATE CATEGORY
    // ======================================

    if (categoryId !== undefined) {
      const category = await Category.findOne({
        _id: categoryId,
        businessId: req.user.businessId,
      });

      if (!category) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      if (!category.status) {
        return res.status(400).json({
          message:
            "Cannot assign product to an inactive category",
        });
      }

      product.categoryId = categoryId;
    }

    // ======================================
    // CHECK SKU
    // ======================================

    if (sku !== undefined) {
      const cleanSku = sku.trim().toUpperCase();

      if (cleanSku) {
        const existingSku =
          await Product.findOne({
            businessId: req.user.businessId,
            sku: cleanSku,
            _id: {
              $ne: req.params.id,
            },
          });

        if (existingSku) {
          return res.status(400).json({
            message: "SKU already exists",
          });
        }

        product.sku = cleanSku;
      } else {
        product.sku = undefined;
      }
    }

    // ======================================
    // CHECK BARCODE
    // ======================================

    if (barcode !== undefined) {
      const cleanBarcode = barcode.trim();

      if (cleanBarcode) {
        const existingBarcode =
          await Product.findOne({
            businessId: req.user.businessId,
            barcode: cleanBarcode,
            _id: {
              $ne: req.params.id,
            },
          });

        if (existingBarcode) {
          return res.status(400).json({
            message: "Barcode already exists",
          });
        }

        product.barcode = cleanBarcode;
      } else {
        product.barcode = undefined;
      }
    }

    // ======================================
    // UPDATE FIELDS
    // ======================================

    if (name !== undefined) {
      product.name = name.trim();
    }

    if (costPrice !== undefined) {
      if (Number(costPrice) < 0) {
        return res.status(400).json({
          message: "Cost price cannot be negative",
        });
      }

      product.costPrice = Number(costPrice);
    }

    if (sellingPrice !== undefined) {
      if (Number(sellingPrice) < 0) {
        return res.status(400).json({
          message:
            "Selling price cannot be negative",
        });
      }

      product.sellingPrice =
        Number(sellingPrice);
    }

    if (stockQuantity !== undefined) {
      if (Number(stockQuantity) < 0) {
        return res.status(400).json({
          message:
            "Stock quantity cannot be negative",
        });
      }

      product.stockQuantity =
        Number(stockQuantity);
    }

    if (lowStockLevel !== undefined) {
      if (Number(lowStockLevel) < 0) {
        return res.status(400).json({
          message:
            "Low stock level cannot be negative",
        });
      }

      product.lowStockLevel =
        Number(lowStockLevel);
    }

    if (unit !== undefined) {
      product.unit =
        unit.trim() || "piece";
    }

    if (taxRate !== undefined) {
      if (Number(taxRate) < 0) {
        return res.status(400).json({
          message:
            "Tax rate cannot be negative",
        });
      }

      product.taxRate =
        Number(taxRate);
    }

    if (typeof status === "boolean") {
      product.status = status;
    }

    await product.save();

    await product.populate(
      "categoryId",
      "name status"
    );

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error("Update Product Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "SKU or barcode already exists",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE PRODUCT STATUS
// PATCH /api/products/:id/status
// ==========================================

export const updateProductStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({
        message: "Status must be true or false",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.status = status;

    await product.save();

    res.status(200).json({
      message:
        "Product status updated successfully",
      product,
    });

  } catch (error) {
    console.error(
      "Update Product Status Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ==========================================

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};