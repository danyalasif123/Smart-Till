import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

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

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 Prevent duplicate category names
 inside the same business.

 Business A can have "Accessories"
 Business B can also have "Accessories"

 But Business A cannot create
 "Accessories" twice.
*/
categorySchema.index(
  {
    businessId: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

const Category = mongoose.model(
  "Category",
  categorySchema
);

export default Category;