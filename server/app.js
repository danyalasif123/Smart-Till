import express from "express";
import cors from "cors";

import businessRoutes from "./routes/businessRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";  
import supplierRoutes from "./routes/supplierRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import saleReturnRoutes from "./routes/saleReturnRoutes.js";
import purchaseReturnRoutes from "./routes/purchaseReturnRoutes.js";
// other routes

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-till-zeta.vercel.app",
      "https://smart-till-a6lwy6ft1-danyalasif123s-projects.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/business", businessRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/purchases",purchaseRoutes);
app.use("/api/reports",reportRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/sale-returns",saleReturnRoutes);
app.use("/api/purchase-returns",purchaseReturnRoutes);
export default app;