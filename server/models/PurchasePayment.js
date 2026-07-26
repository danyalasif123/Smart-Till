import mongoose from "mongoose";

const purchasePaymentSchema =
  new mongoose.Schema(
    {
      // Purchase this payment belongs to
      purchaseId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Purchase",

        required: true,
      },

      // Supplier being paid
      supplierId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Supplier",

        required: true,
      },

      // Amount paid
      amount: {
        type: Number,

        required: true,

        min: 0.01,
      },

      // How supplier was paid
      paymentMethod: {
        type: String,

        enum: [
          "cash",
          "card",
          "bank_transfer",
          "cheque",
          "other",
        ],

        required: true,
      },

      // Bank / transaction / cheque reference
      reference: {
        type: String,

        trim: true,

        default: "",
      },

      // Optional notes
      notes: {
        type: String,

        trim: true,

        default: "",
      },

      // Business isolation
      businessId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Business",

        required: true,
      },

      // User who recorded payment
      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,

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

purchasePaymentSchema.index({
  businessId: 1,
  purchaseId: 1,
  createdAt: -1,
});

purchasePaymentSchema.index({
  businessId: 1,
  supplierId: 1,
  createdAt: -1,
});


const PurchasePayment =
  mongoose.model(
    "PurchasePayment",
    purchasePaymentSchema
  );

export default PurchasePayment;