import mongoose from "mongoose";

// ==========================================
// SALE ITEM SCHEMA
// ==========================================

const saleItemSchema = new mongoose.Schema(
  {
    // Original product reference
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ======================================
    // PRODUCT SNAPSHOT
    // Keeps historical sale information
    // even if product changes later
    // ======================================

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      trim: true,
      default: "",
    },

    barcode: {
      type: String,
      trim: true,
      default: "",
    },
unitCost: {
  type: Number,
  required: true,
  min: 0,
},
    unit: {
      type: String,
      trim: true,
      default: "",
    },

    // Price customer paid per unit
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.001,
    },

    // unitPrice × quantity
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);


// ==========================================
// SALE SCHEMA
// ==========================================

const saleSchema = new mongoose.Schema(
  {
    // ======================================
    // SALE NUMBER
    // Example:
    // SALE-A82F19C4
    // ======================================

    saleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    // ======================================
    // SALE SOURCE
    // ======================================

    source: {
      type: String,
      enum: ["pos", "online"],
      default: "pos",
      required: true,
    },

    // ======================================
    // CUSTOMER
    //
    // null = anonymous walk-in customer
    // ======================================

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    // ======================================
    // CASHIER
    //
    // For POS this will normally contain
    // the logged-in cashier/admin/manager.
    //
    // Online orders may not have a cashier.
    // ======================================

    cashierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ======================================
    // ITEMS
    // ======================================

    items: {
      type: [saleItemSchema],

      validate: {
        validator: function (items) {
          return items.length > 0;
        },

        message:
          "A sale must contain at least one product",
      },
    },

    // ======================================
    // FINANCIAL TOTALS
    // ======================================

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    // ======================================
    // PAYMENT
    // ======================================

    paymentMethod: {
      type: String,

      enum: [
        "cash",
        "card",
        "online",
        "other",
      ],

      required: true,
    },

    // ======================================
    // PAYMENT STATUS
    // ======================================

    paymentStatus: {
      type: String,

      enum: [
        "paid",
        "pending",
        "failed",
        "refunded",
      ],

      default: "paid",
    },

    // ======================================
    // SALE STATUS
    // ======================================

    status: {
      type: String,

      enum: [
        "completed",
        "pending",
        "cancelled",
        "refunded",
      ],

      default: "completed",
    },

    // ======================================
    // ONLINE ORDER REFERENCE
    //
    // Later a website can send its own
    // order number.
    //
    // Example:
    // WEB-ORDER-1055
    // ======================================

    externalOrderId: {
      type: String,
      trim: true,
      default: "",
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
    // BUSINESS
    // ======================================

    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    // ======================================
    // CREATED BY
    // ======================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// ==========================================
// INDEXES
// ==========================================

// Business sales sorted by newest
saleSchema.index({
  businessId: 1,
  createdAt: -1,
});


// Customer purchase history
saleSchema.index({
  businessId: 1,
  customerId: 1,
  createdAt: -1,
});


// Cashier sales history
saleSchema.index({
  businessId: 1,
  cashierId: 1,
  createdAt: -1,
});


// Online order lookup
saleSchema.index({
  businessId: 1,
  externalOrderId: 1,
});


// ==========================================
// MODEL
// ==========================================

const Sale = mongoose.model(
  "Sale",
  saleSchema
);

export default Sale;