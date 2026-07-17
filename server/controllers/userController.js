import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      businessId: req.user.businessId,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      businessId: req.user.businessId,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  res.json({
    message: "Get Single User API",
  });
};

export const updateUser = async (req, res) => {
  res.json({
    message: "Update User API",
  });
};

export const updateUserStatus = async (req, res) => {
  res.json({
    message: "Update User Status API",
  });
};