import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    // Supplier / company name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Contact person's name
    contactPerson: {
      type: String,
      trim: true,
      default: "",
    },

    // Supplier email
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // Supplier phone
    phone: {
      type: String,
      trim: true,
      default: "",
    },

    // Supplier address
    address: {
      type: String,
      trim: true,
      default: "",
    },

    // City
    city: {
      type: String,
      trim: true,
      default: "",
    },

    // Postcode / ZIP code
    postcode: {
      type: String,
      trim: true,
      default: "",
    },

    // Country
    country: {
      type: String,
      trim: true,
      default: "",
    },

    // Additional supplier notes
    notes: {
      type: String,
      trim: true,
      default: "",
    },

    // Active / inactive supplier
    status: {
      type: Boolean,
      default: true,
    },

    // Business that owns this supplier
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    // User who created supplier
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

// Faster supplier lookup within a business
supplierSchema.index({
  businessId: 1,
  name: 1,
});

const Supplier = mongoose.model(
  "Supplier",
  supplierSchema
);

export default Supplier;