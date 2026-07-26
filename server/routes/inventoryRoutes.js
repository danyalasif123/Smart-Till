import express from "express";

import {
  getInventory,
  getLowStockProducts,
  getStockTransactions,
  getProductStockHistory,
  adjustStock,
} from "../controllers/inventoryController.js";

import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();


// ==========================================
// ALL INVENTORY
// ==========================================

router.get(
  "/",
  verifyToken,
  getInventory
);


// ==========================================
// LOW STOCK
//
// IMPORTANT:
// Must remain BEFORE /product/:productId
// ==========================================

router.get(
  "/low-stock",
  verifyToken,
  getLowStockProducts
);


// ==========================================
// ALL STOCK TRANSACTIONS
// ==========================================

router.get(
  "/transactions",
  verifyToken,
  getStockTransactions
);


// ==========================================
// PRODUCT STOCK HISTORY
// ==========================================

router.get(
  "/product/:productId",
  verifyToken,
  getProductStockHistory
);


// ==========================================
// MANUAL STOCK ADJUSTMENT
//
// Admin only for now
// ==========================================

router.post(
  "/adjust",
  verifyToken,
  isAdmin,
  adjustStock
);


export default router;