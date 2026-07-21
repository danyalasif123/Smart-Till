import express from "express";
import cors from "cors";

import businessRoutes from "./routes/businessRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/business", businessRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

export default app;