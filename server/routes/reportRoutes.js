import express from "express";

import {
  getSalesReport,
  getProfitReport,
  getPurchaseReport,
  getInventoryReport,
  getLowStockReport,
  getCustomerReport,
  getProductReport
} from "../controllers/reportController.js";
import verifyToken from "../middleware/verifyToken.js";

const router =
  express.Router();


// ==========================================
// SALES REPORT
//
// GET /api/reports/sales
//
// Admin / Manager
// ==========================================

router.get(
  "/sales",
  verifyToken,
  getSalesReport
);

// ==========================================
// PROFIT REPORT
// GET /api/reports/profit
// ==========================================

router.get(
  "/profit",
  verifyToken,
  getProfitReport
);
// ==========================================
// PURCHASE REPORT
// GET /api/reports/purchases
// ==========================================

router.get(
  "/purchases",
  verifyToken,
  getPurchaseReport
);
// ==========================================
// INVENTORY REPORT
// GET /api/reports/inventory
// ==========================================

router.get(
  "/inventory",
  verifyToken,
  getInventoryReport
);
// ==========================================
// LOW STOCK REPORT
// GET /api/reports/low-stock
// ==========================================

router.get(
  "/low-stock",
  verifyToken,
  getLowStockReport
);
// ==========================================
// CUSTOMER REPORT
// GET /api/reports/customers
// ==========================================

router.get(
  "/customers",
  verifyToken,
  getCustomerReport
);
// ==========================================
// PRODUCT PERFORMANCE REPORT
// GET /api/reports/products
// ==========================================

router.get(
  "/products",
  verifyToken,
  getProductReport
);
export default router;