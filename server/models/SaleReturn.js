import mongoose from "mongoose";

const saleReturnItemSchema =
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

      quantitySold: {
        type: Number,
        required: true,
      },

      quantityReturned: {
        type: Number,
        required: true,
      },

      unitPrice: {
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

const saleReturnSchema =
  new mongoose.Schema(
    {
      businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
      },

      saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale",
        required: true,
      },

      returnNumber: {
        type: String,
        required: true,
        unique: true,
      },

      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },

      items: [
        saleReturnItemSchema,
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
          "customer_changed_mind",
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

export default mongoose.model(
  "SaleReturn",
  saleReturnSchema
);