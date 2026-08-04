import express from "express";

import {
  createPurchaseReturn,
  getPurchaseReturns,
  getPurchaseReturnById,
} from "../controllers/purchaseReturnController.js";

import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// ==========================================
// GET ALL PURCHASE RETURNS
// ==========================================

router.get(
  "/",
  verifyToken,
  isAdmin,
  getPurchaseReturns
);

// ==========================================
// GET SINGLE PURCHASE RETURN
// ==========================================

router.get(
  "/:id",
  verifyToken,
  isAdmin,
  getPurchaseReturnById
);

// ==========================================
// CREATE PURCHASE RETURN
// ==========================================

router.post(
  "/",
  verifyToken,
  isAdmin,
  createPurchaseReturn
);

export default router;