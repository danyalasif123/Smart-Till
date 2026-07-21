import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "../controllers/categoryController.js";

import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();


// ==========================================
// CREATE CATEGORY
// Admin only for now
// POST /api/categories
// ==========================================

router.post(
  "/",
  verifyToken,
  isAdmin,
  createCategory
);


// ==========================================
// GET ALL CATEGORIES
// Admin only for now
// GET /api/categories
// ==========================================

router.get(
  "/",
  verifyToken,
  isAdmin,
  getCategories
);


// ==========================================
// GET SINGLE CATEGORY
// GET /api/categories/:id
// ==========================================

router.get(
  "/:id",
  verifyToken,
  isAdmin,
  getCategoryById
);


// ==========================================
// UPDATE CATEGORY
// PUT /api/categories/:id
// ==========================================

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateCategory
);


// ==========================================
// UPDATE CATEGORY STATUS
// PATCH /api/categories/:id/status
// ==========================================

router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  updateCategoryStatus
);


// ==========================================
// DELETE CATEGORY
// DELETE /api/categories/:id
// ==========================================

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteCategory
);


export default router;