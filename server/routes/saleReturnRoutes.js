import express from "express";

import {
  createSaleReturn,
  getSaleReturns,
  getSaleReturnById,
} from "../controllers/saleReturnController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// ==========================================
// CREATE SALE RETURN
// POST /api/sale-returns
// ==========================================

router.post(
  "/",
  verifyToken,
  createSaleReturn
);

// ==========================================
// GET ALL SALE RETURNS
// GET /api/sale-returns
// ==========================================

router.get(
  "/",
  verifyToken,
  getSaleReturns
);

// ==========================================
// GET SINGLE SALE RETURN
// GET /api/sale-returns/:id
// ==========================================

router.get(
  "/:id",
  verifyToken,
  getSaleReturnById
);

export default router;