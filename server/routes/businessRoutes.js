import express from "express";
import { registerBusiness } from "../controllers/businessController.js";

const router = express.Router();

router.post("/register", registerBusiness);

export default router;