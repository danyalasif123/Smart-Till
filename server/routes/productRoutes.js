import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} from "../controllers/productController.js";

import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// Create Product
router.post(
  "/",
  verifyToken,
  isAdmin,
  createProduct
);

// Get All Products
router.get(
  "/",
  verifyToken,
  isAdmin,
  getProducts
);

// Get Product By ID
router.get(
  "/:id",
  verifyToken,
  isAdmin,
  getProductById
);

// Update Product
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateProduct
);

// Update Product Status
router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  updateProductStatus
);

// Delete Product
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteProduct
);

export default router;