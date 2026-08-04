import mongoose from "mongoose";


// ==========================================
// PURCHASE ITEM SCHEMA
// ==========================================

const purchaseItemSchema =
  new mongoose.Schema(
    {
      // Product being purchased
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      // Snapshot of product name
      productName: {
        type: String,
        required: true,
        trim: true,
      },

      // Snapshot of SKU
      sku: {
        type: String,
        default: "",
        trim: true,
      },

      // Quantity ordered
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
returnedQuantity: {
  type: Number,
  default: 0,
},
      // Cost per unit from supplier
      unitCost: {
        type: Number,
        required: true,
        min: 0,
      },

      // quantity × unitCost
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
// PURCHASE SCHEMA
// ==========================================

const purchaseSchema =
  new mongoose.Schema(
    {
      // ======================================
      // PURCHASE NUMBER
      //
      // Example:
      // PUR-A82F19C4
      // ======================================

      purchaseNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
      },


      // ======================================
      // SUPPLIER
      // ======================================

      supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
      },


      // ======================================
      // ITEMS
      // ======================================

      items: {
        type: [purchaseItemSchema],
        required: true,

        validate: {
          validator: (items) =>
            Array.isArray(items) &&
            items.length > 0,

          message:
            "Purchase must contain at least one product",
        },
      },


      // ======================================
      // SUBTOTAL
      // ======================================

      subtotal: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },


      // ======================================
      // DISCOUNT
      // ======================================

      discount: {
        type: Number,
        default: 0,
        min: 0,
      },


      // ======================================
      // TAX
      // ======================================

      tax: {
        type: Number,
        default: 0,
        min: 0,
      },


      // ======================================
      // FINAL TOTAL
      //
      // subtotal - discount + tax
      // ======================================

      total: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },


      // ======================================
      // SUPPLIER INVOICE / REFERENCE
      //
      // Example:
      // INV-ABC-1042
      // ======================================

      supplierReference: {
        type: String,
        default: "",
        trim: true,
      },


      // ======================================
      // PURCHASE STATUS
      //
      // pending:
      // Purchase created but stock NOT added.
      //
      // received:
      // Products received and stock added.
      //
      // cancelled:
      // Purchase cancelled.
      // ======================================
status: {
  type: String,

  enum: [
    "pending",
    "received",
    "partially_returned",
    "returned",
    "cancelled",
  ],

  default: "pending",
},


      // ======================================
      // PAYMENT STATUS
      //
      // Separate from stock receiving.
      //
      // Supplier invoice could be unpaid
      // even though products were received.
      // ======================================

      paymentStatus: {
        type: String,

        enum: [
          "unpaid",
          "partial",
          "paid",
        ],

        default: "unpaid",
      },


      // ======================================
      // AMOUNT PAID
      // ======================================

      amountPaid: {
        type: Number,
        default: 0,
        min: 0,
      },


      // ======================================
      // NOTES
      // ======================================

      notes: {
        type: String,
        default: "",
        trim: true,
      },


      // ======================================
      // RECEIVED DATE
      //
      // null while pending.
      // Set when Receive Stock is clicked.
      // ======================================

      receivedAt: {
        type: Date,
        default: null,
      },


      // ======================================
      // RECEIVED BY
      // ======================================

      receivedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },


      // ======================================
      // BUSINESS
      // ======================================

      businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
      },


      // ======================================
      // CREATED BY
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


// ==========================================
// INDEXES
// ==========================================

// Fast business purchase listing
purchaseSchema.index({
  businessId: 1,
  createdAt: -1,
});


// Find purchases for supplier
purchaseSchema.index({
  businessId: 1,
  supplierId: 1,
});


// Filter by purchase status
purchaseSchema.index({
  businessId: 1,
  status: 1,
});


// Supplier reference lookup
purchaseSchema.index({
  businessId: 1,
  supplierReference: 1,
});


// ==========================================
// MODEL
// ==========================================

const Purchase = mongoose.model(
  "Purchase",
  purchaseSchema
);

export default Purchase;