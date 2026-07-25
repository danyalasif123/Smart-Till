import Customer from "../models/Customer.js";
import crypto from "crypto";


// ==========================================
// GENERATE CUSTOMER NUMBER
// Example: CUST-A82F19C4
// ==========================================

const generateCustomerNumber = () => {
  const code = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `CUST-${code}`;
};


// ==========================================
// CREATE CUSTOMER
// POST /api/customers
// ==========================================

export const createCustomer = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      city,
      postcode,
      country,
      notes,
      status,
    } = req.body;

    // ======================================
    // VALIDATE NAME
    // ======================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Customer name is required",
      });
    }

    // ======================================
    // CLEAN VALUES
    // ======================================

    const cleanPhone = phone?.trim() || "";

    const cleanEmail =
      email?.trim().toLowerCase() || "";

    // ======================================
    // CHECK DUPLICATE PHONE
    // ======================================

    if (cleanPhone) {
      const existingPhone = await Customer.findOne({
        businessId: req.user.businessId,
        phone: cleanPhone,
      });

      if (existingPhone) {
        return res.status(400).json({
          message:
            "A customer with this phone number already exists",
        });
      }
    }

    // ======================================
    // CHECK DUPLICATE EMAIL
    // ======================================

    if (cleanEmail) {
      const existingEmail = await Customer.findOne({
        businessId: req.user.businessId,
        email: cleanEmail,
      });

      if (existingEmail) {
        return res.status(400).json({
          message:
            "A customer with this email already exists",
        });
      }
    }

    // ======================================
    // GENERATE CUSTOMER NUMBER
    // ======================================

    let customerNumber;
    let customerNumberExists = true;

    while (customerNumberExists) {
      customerNumber = generateCustomerNumber();

      customerNumberExists =
        await Customer.exists({
          customerNumber,
        });
    }

    // ======================================
    // CREATE CUSTOMER
    // ======================================

    const customer = await Customer.create({
      customerNumber,

      name: name.trim(),

      phone: cleanPhone,

      email: cleanEmail,

      address:
        address?.trim() || "",

      city:
        city?.trim() || "",

      postcode:
        postcode?.trim() || "",

      country:
        country?.trim() || "",

      notes:
        notes?.trim() || "",

      status:
        typeof status === "boolean"
          ? status
          : true,

      // Sales statistics start at zero.
      // They will only be updated by Sales.
      totalOrders: 0,

      totalSpent: 0,

      lastPurchaseAt: null,

      businessId:
        req.user.businessId,

      createdBy:
        req.user.id,
    });

    res.status(201).json({
      message:
        "Customer created successfully",

      customer,
    });

  } catch (error) {
    console.error(
      "Create Customer Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL CUSTOMERS
// GET /api/customers
// ==========================================

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({
      businessId: req.user.businessId,
    })
      .select("-__v")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      count: customers.length,
      customers,
    });

  } catch (error) {
    console.error(
      "Get Customers Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET CUSTOMER BY ID
// GET /api/customers/:id
// ==========================================

export const getCustomerById = async (
  req,
  res
) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,

      businessId:
        req.user.businessId,
    })
      .populate(
        "createdBy",
        "name email role"
      )
      .select("-__v");

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      customer,
    });

  } catch (error) {
    console.error(
      "Get Customer Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET CUSTOMER BY CUSTOMER NUMBER
//
// Example:
// GET /api/customers/number/CUST-A82F19C4
//
// Useful later for:
// barcode
// QR
// loyalty card
// POS customer identification
// ==========================================

export const getCustomerByNumber = async (
  req,
  res
) => {
  try {
    const customerNumber =
      req.params.customerNumber
        ?.trim()
        .toUpperCase();

    if (!customerNumber) {
      return res.status(400).json({
        message:
          "Customer number is required",
      });
    }

    const customer = await Customer.findOne({
      customerNumber,

      businessId:
        req.user.businessId,
    }).select("-__v");

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      customer,
    });

  } catch (error) {
    console.error(
      "Get Customer By Number Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE CUSTOMER
// PUT /api/customers/:id
// ==========================================

export const updateCustomer = async (
  req,
  res
) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      city,
      postcode,
      country,
      notes,
      status,
    } = req.body;

    // ======================================
    // FIND CUSTOMER
    // ======================================

    const customer = await Customer.findOne({
      _id: req.params.id,

      businessId:
        req.user.businessId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // ======================================
    // VALIDATE NAME
    // ======================================

    if (
      name !== undefined &&
      !name.trim()
    ) {
      return res.status(400).json({
        message:
          "Customer name cannot be empty",
      });
    }

    // ======================================
    // PHONE
    // ======================================

    if (phone !== undefined) {
      const cleanPhone =
        phone.trim();

      if (cleanPhone) {
        const existingPhone =
          await Customer.findOne({
            businessId:
              req.user.businessId,

            phone: cleanPhone,

            _id: {
              $ne: req.params.id,
            },
          });

        if (existingPhone) {
          return res.status(400).json({
            message:
              "Another customer with this phone number already exists",
          });
        }
      }

      customer.phone =
        cleanPhone;
    }

    // ======================================
    // EMAIL
    // ======================================

    if (email !== undefined) {
      const cleanEmail =
        email
          .trim()
          .toLowerCase();

      if (cleanEmail) {
        const existingEmail =
          await Customer.findOne({
            businessId:
              req.user.businessId,

            email: cleanEmail,

            _id: {
              $ne: req.params.id,
            },
          });

        if (existingEmail) {
          return res.status(400).json({
            message:
              "Another customer with this email already exists",
          });
        }
      }

      customer.email =
        cleanEmail;
    }

    // ======================================
    // NORMAL FIELDS
    // ======================================

    if (name !== undefined) {
      customer.name =
        name.trim();
    }

    if (address !== undefined) {
      customer.address =
        address.trim();
    }

    if (city !== undefined) {
      customer.city =
        city.trim();
    }

    if (postcode !== undefined) {
      customer.postcode =
        postcode.trim();
    }

    if (country !== undefined) {
      customer.country =
        country.trim();
    }

    if (notes !== undefined) {
      customer.notes =
        notes.trim();
    }

    if (
      typeof status === "boolean"
    ) {
      customer.status =
        status;
    }

    /*
      IMPORTANT

      We intentionally DO NOT allow
      normal CRUD to modify:

      customerNumber
      totalOrders
      totalSpent
      lastPurchaseAt

      customerNumber is generated by
      the system.

      Sales statistics will only be
      controlled by the Sales system.
    */

    await customer.save();

    res.status(200).json({
      message:
        "Customer updated successfully",

      customer,
    });

  } catch (error) {
    console.error(
      "Update Customer Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE CUSTOMER STATUS
// PATCH /api/customers/:id/status
// ==========================================

export const updateCustomerStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    // ======================================
    // VALIDATE STATUS
    // ======================================

    if (
      typeof status !== "boolean"
    ) {
      return res.status(400).json({
        message:
          "Status must be true or false",
      });
    }

    // ======================================
    // FIND CUSTOMER
    // ======================================

    const customer = await Customer.findOne({
      _id: req.params.id,

      businessId:
        req.user.businessId,
    });

    if (!customer) {
      return res.status(404).json({
        message:
          "Customer not found",
      });
    }

    // ======================================
    // UPDATE STATUS
    // ======================================

    customer.status =
      status;

    await customer.save();

    res.status(200).json({
      message:
        "Customer status updated successfully",

      customer,
    });

  } catch (error) {
    console.error(
      "Update Customer Status Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// DELETE CUSTOMER
// DELETE /api/customers/:id
// ==========================================

export const deleteCustomer = async (
  req,
  res
) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,

      businessId:
        req.user.businessId,
    });

    if (!customer) {
      return res.status(404).json({
        message:
          "Customer not found",
      });
    }

    /*
      IMPORTANT

      Once the Sales module exists,
      customers with purchase history
      should NOT be permanently deleted.

      Later we will change this to:

      if customer has sales
          → deactivate customer

      if customer has no sales
          → allow deletion

      This protects historical receipts.
    */

    await customer.deleteOne();

    res.status(200).json({
      message:
        "Customer deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Customer Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};




