import mongoose from "mongoose";

const stockTransactionSchema =
  new mongoose.Schema(
    {
      // ======================================
      // BUSINESS
      // ======================================

      businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
        index: true,
      },

      // ======================================
      // PRODUCT
      // ======================================

      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      // ======================================
      // TRANSACTION TYPE
      // ======================================

      type: {
        type: String,

        enum: [
          "sale",
          "purchase",
          "adjustment",
          "damage",
          "return",
          "opening",
        ],

        required: true,
      },

      // ======================================
      // QUANTITY CHANGE
      //
      // +20 = stock added
      // -5  = stock removed
      // ======================================

      quantity: {
        type: Number,
        required: true,
      },

      // ======================================
      // STOCK BEFORE TRANSACTION
      // ======================================

      stockBefore: {
        type: Number,
        required: true,
        min: 0,
      },

      // ======================================
      // STOCK AFTER TRANSACTION
      // ======================================

      stockAfter: {
        type: Number,
        required: true,
        min: 0,
      },

      // ======================================
      // REFERENCE
      //
      // Example:
      // SALE-A82F19
      // PURCHASE-001
      // ======================================

      reference: {
        type: String,
        trim: true,
        default: "",
      },

      // ======================================
      // OPTIONAL REFERENCE ID
      //
      // Can point to Sale / Purchase later
      // ======================================

      referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },

      // ======================================
      // NOTES
      // ======================================

      notes: {
        type: String,
        trim: true,
        default: "",
      },

      // ======================================
      // USER WHO CAUSED THE CHANGE
      // ======================================

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

// Useful when loading a product's stock history
stockTransactionSchema.index({
  businessId: 1,
  productId: 1,
  createdAt: -1,
});

const StockTransaction =
  mongoose.model(
    "StockTransaction",
    stockTransactionSchema
  );

export default StockTransaction;