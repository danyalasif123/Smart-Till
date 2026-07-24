import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    // ==========================================
    // CUSTOMER NUMBER
    // Public/customer-facing identifier
    // Example: CUST-A8F29C
    // ==========================================

    customerNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // ==========================================
    // ADDRESS
    // ==========================================

    address: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    postcode: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // SALES SUMMARY
    // Updated by Sales system only
    // ==========================================

    totalOrders: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastPurchaseAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // OTHER INFORMATION
    // ==========================================

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // BUSINESS
    // ==========================================

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

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

// ==========================================
// INDEXES
// ==========================================

customerSchema.index({
  businessId: 1,
  name: 1,
});

customerSchema.index({
  businessId: 1,
  phone: 1,
});

customerSchema.index({
  businessId: 1,
  email: 1,
});

// ==========================================
// CUSTOMER TYPE
// ==========================================

customerSchema.virtual("customerType").get(function () {
  return this.totalOrders >= 3
    ? "repeat"
    : "regular";
});

customerSchema.set("toJSON", {
  virtuals: true,
});

customerSchema.set("toObject", {
  virtuals: true,
});

const Customer = mongoose.model(
  "Customer",
  customerSchema
);

export default Customer;