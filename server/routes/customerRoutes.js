import express from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
} from "../controllers/customerController.js";

import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();


// ==========================================
// CREATE CUSTOMER
// Admin / Manager / Cashier
// POST /api/customers
// ==========================================

router.post(
  "/",
  verifyToken,
  createCustomer
);


// ==========================================
// GET ALL CUSTOMERS
// Admin / Manager / Cashier
// GET /api/customers
// ==========================================

router.get(
  "/",
  verifyToken,
  getCustomers
);


// ==========================================
// GET CUSTOMER BY ID
// Admin / Manager / Cashier
// GET /api/customers/:id
// ==========================================

router.get(
  "/:id",
  verifyToken,
  getCustomerById
);


// ==========================================
// UPDATE CUSTOMER
// Admin only for now
// PUT /api/customers/:id
// ==========================================

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  updateCustomer
);


// ==========================================
// UPDATE CUSTOMER STATUS
// Admin only
// PATCH /api/customers/:id/status
// ==========================================

router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  updateCustomerStatus
);


// ==========================================
// DELETE CUSTOMER
// Admin only
// DELETE /api/customers/:id
// ==========================================

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteCustomer
);


export default router;