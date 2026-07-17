import express from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
} from "../controllers/userController.js";

import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, createUser);

router.get("/", verifyToken, isAdmin, getUsers);

router.get("/:id", verifyToken, isAdmin, getUserById);

router.put("/:id", verifyToken, isAdmin, updateUser);

router.patch("/:id/status", verifyToken, isAdmin, updateUserStatus);

export default router;