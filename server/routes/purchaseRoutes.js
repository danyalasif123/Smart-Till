import express from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  receivePurchase,
  cancelPurchase,
  recordPurchasePayment,
} from "../controllers/purchaseController.js";

import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();


// ==========================================
// CREATE PURCHASE
// POST /api/purchases
// ==========================================

router.post(
  "/",
  verifyToken,
  isAdmin,
  createPurchase
);


// ==========================================
// GET ALL PURCHASES
// GET /api/purchases
// ==========================================

router.get(
  "/",
  verifyToken,
  getPurchases
);


// ==========================================
// RECEIVE PURCHASE
// PATCH /api/purchases/:id/receive
//
// IMPORTANT:
// Keep this before /:id
// ==========================================

router.patch(
  "/:id/receive",
  verifyToken,
  isAdmin,
  receivePurchase
);


// ==========================================
// CANCEL PURCHASE
// PATCH /api/purchases/:id/cancel
// ==========================================

router.patch(
  "/:id/cancel",
  verifyToken,
  isAdmin,
  cancelPurchase
);


// ==========================================
// GET PURCHASE BY ID
// GET /api/purchases/:id
// ==========================================

router.get(
  "/:id",
  verifyToken,
  getPurchaseById
);
// ==========================================
// RECORD PURCHASE PAYMENT
// PATCH /api/purchases/:id/payment
// ==========================================

router.patch(
  "/:id/payment",
  verifyToken,
  isAdmin,
  recordPurchasePayment
);


export default router;