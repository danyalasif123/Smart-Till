import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Internal product code
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },

    // Barcode scanned at POS
    barcode: {
      type: String,
      trim: true,
    },

    // Product category
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Price business pays for product
    costPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Price customer pays
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Current available stock
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Alert when stock reaches this level
    lowStockLevel: {
      type: Number,
      default: 5,
      min: 0,
    },

    // Generic measurement unit
    unit: {
      type: String,
      default: "piece",
      trim: true,
    },

    // Optional tax percentage
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product active / inactive
    status: {
      type: Boolean,
      default: true,
    },

    // Business that owns this product
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    // User who created product
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// SKU must be unique inside each business.
// Different businesses can use the same SKU.
productSchema.index(
  {
    businessId: 1,
    sku: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

// Barcode must also be unique inside each business.
productSchema.index(
  {
    businessId: 1,
    barcode: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;