import User from "../models/User.js";
import bcrypt from "bcryptjs";

// =======================
// Create User
// =======================
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists in the same business
    const existingUser = await User.findOne({
      email,
      businessId: req.user.businessId,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      businessId: req.user.businessId,
      createdBy: req.user.id,
      status: true,
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

// =======================
// Get All Users
// =======================
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

// =======================
// Get User By ID
// =======================
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Update User
// =======================
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if another user already has this email
    const emailExists = await User.findOne({
      email,
      businessId: req.user.businessId,
      _id: { $ne: req.params.id },
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    user.name = name;
    user.email = email;
    user.role = role;
    user.status = status;

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Update User Status
// =======================
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.status = status;

    await user.save();

    res.status(200).json({
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};