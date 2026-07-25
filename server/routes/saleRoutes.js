import express from "express";

import {
  createSale,
  getSales,
  getSaleById,
  getCustomerSales,
} from "../controllers/saleController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();


// ==========================================
// CREATE SALE
// POST /api/sales
// ==========================================

router.post(
  "/",
  verifyToken,
  createSale
);


// ==========================================
// GET ALL SALES
// GET /api/sales
// ==========================================

router.get(
  "/",
  verifyToken,
  getSales
);


// ==========================================
// GET CUSTOMER SALES
//
// IMPORTANT:
// Keep this BEFORE /:id
// ==========================================

router.get(
  "/customer/:customerId",
  verifyToken,
  getCustomerSales
);


// ==========================================
// GET SINGLE SALE
// GET /api/sales/:id
// ==========================================

router.get(
  "/:id",
  verifyToken,
  getSaleById
);


export default router;