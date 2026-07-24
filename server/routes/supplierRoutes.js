import express from "express";

import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  updateSupplierStatus,
  deleteSupplier,
} from "../controllers/supplierController.js";

import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// ==========================================
// CREATE SUPPLIER
// POST /api/suppliers
// ==========================================

router.post(
  "/",
  verifyToken,
  isAdmin,
  createSupplier
);

// ==========================================
// GET ALL SUPPLIERS
// GET /api/suppliers
// ==========================================

router.get(
  "/",
  verifyToken,
  isAdmin,
  getSuppliers
);

// ==========================================
// GET SUPPLIER BY ID
// GET /api/suppliers/:id
// ==========================================

router.get(
  "/:id",
  verifyToken,
  isAdmin,
  getSupplierById
);

// ==========================================
// UPDATE SUPPLIER
// PUT /api/suppliers/:id
// ==========================================

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateSupplier
);

// ==========================================
// UPDATE SUPPLIER STATUS
// PATCH /api/suppliers/:id/status
// ==========================================

router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  updateSupplierStatus
);

// ==========================================
// DELETE SUPPLIER
// DELETE /api/suppliers/:id
// ==========================================

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteSupplier
);

export default router;