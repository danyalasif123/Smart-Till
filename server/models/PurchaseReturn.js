import mongoose from "mongoose";

// ==========================================
// PURCHASE RETURN ITEM
// ==========================================

const purchaseReturnItemSchema =
  new mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      productName: {
        type: String,
        required: true,
      },

      sku: {
        type: String,
      },

      quantityPurchased: {
        type: Number,
        required: true,
      },

      quantityReturned: {
        type: Number,
        required: true,
      },

      unitCost: {
        type: Number,
        required: true,
      },

      refundAmount: {
        type: Number,
        required: true,
      },
    },
    {
      _id: false,
    }
  );

// ==========================================
// PURCHASE RETURN
// ==========================================

const purchaseReturnSchema =
  new mongoose.Schema(
    {
      businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
      },

      purchaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Purchase",
        required: true,
      },

      returnNumber: {
        type: String,
        required: true,
        unique: true,
      },

      supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
      },

      items: [
        purchaseReturnItemSchema,
      ],

      totalRefund: {
        type: Number,
        required: true,
        default: 0,
      },

      reason: {
        type: String,
        enum: [
          "damaged",
          "wrong_product",
          "supplier_error",
          "expired",
          "other",
        ],
        required: true,
      },

      notes: {
        type: String,
        trim: true,
      },

      returnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

// ==========================================
// INDEXES
// ==========================================

purchaseReturnSchema.index({
  businessId: 1,
  createdAt: -1,
});

purchaseReturnSchema.index({
  purchaseId: 1,
});

purchaseReturnSchema.index({
  supplierId: 1,
});

// ==========================================

export default mongoose.model(
  "PurchaseReturn",
  purchaseReturnSchema
);