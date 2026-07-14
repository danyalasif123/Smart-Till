const Business = require("../models/Business");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.registerBusiness = async (req, res) => {
  try {
    const {
      businessName,
      email,
      phone,
      address,
      adminName,
      adminEmail,
      password,
    } = req.body;

    const businessExist = await Business.findOne({ email });

    if (businessExist) {
      return res.status(400).json({
        message: "Business already exists",
      });
    }

    const adminExist = await User.findOne({
      email: adminEmail,
    });

    if (adminExist) {
      return res.status(400).json({
        message: "Admin email already exists",
      });
    }

    const business = await Business.create({
      businessName,
      email,
      phone,
      address,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      businessId: business._id,
    });

    admin.createdBy = admin._id;
    await admin.save();

    res.status(201).json({
      message: "Business Registered Successfully",
      business,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};