import Supplier from "../models/Supplier.js";


// ==========================================
// CREATE SUPPLIER
// POST /api/suppliers
// ==========================================

export const createSupplier = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address,
      city,
      postcode,
      country,
      notes,
      status,
    } = req.body;

    // Validate name
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Supplier name is required",
      });
    }

    // Check duplicate supplier name
    // inside the same business
    const existingSupplier = await Supplier.findOne({
      businessId: req.user.businessId,
      name: name.trim(),
    });

    if (existingSupplier) {
      return res.status(400).json({
        message: "Supplier already exists",
      });
    }

    const supplier = await Supplier.create({
      name: name.trim(),

      contactPerson: contactPerson?.trim() || "",

      email: email?.trim().toLowerCase() || "",

      phone: phone?.trim() || "",

      address: address?.trim() || "",

      city: city?.trim() || "",

      postcode: postcode?.trim() || "",

      country: country?.trim() || "",

      notes: notes?.trim() || "",

      status:
        typeof status === "boolean"
          ? status
          : true,

      businessId: req.user.businessId,

      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Supplier created successfully",
      supplier,
    });

  } catch (error) {
    console.error("Create Supplier Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL SUPPLIERS
// GET /api/suppliers
// ==========================================

export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      businessId: req.user.businessId,
    })
      .populate(
        "createdBy",
        "name email"
      )
      .select("-__v")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      count: suppliers.length,
      suppliers,
    });

  } catch (error) {
    console.error("Get Suppliers Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET SUPPLIER BY ID
// GET /api/suppliers/:id
// ==========================================

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    })
      .populate(
        "createdBy",
        "name email"
      )
      .select("-__v");

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      supplier,
    });

  } catch (error) {
    console.error("Get Supplier Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE SUPPLIER
// PUT /api/suppliers/:id
// ==========================================

export const updateSupplier = async (req, res) => {
  try {
    const {
      name,
      contactPerson,
      email,
      phone,
      address,
      city,
      postcode,
      country,
      notes,
      status,
    } = req.body;

    const supplier = await Supplier.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    // Validate supplier name
    if (
      name !== undefined &&
      !name.trim()
    ) {
      return res.status(400).json({
        message: "Supplier name cannot be empty",
      });
    }

    // Check duplicate name if changing it
    if (
      name !== undefined &&
      name.trim().toLowerCase() !==
        supplier.name.toLowerCase()
    ) {
      const existingSupplier =
        await Supplier.findOne({
          businessId: req.user.businessId,

          name: name.trim(),

          _id: {
            $ne: req.params.id,
          },
        });

      if (existingSupplier) {
        return res.status(400).json({
          message:
            "Another supplier with this name already exists",
        });
      }
    }

    // Update fields

    if (name !== undefined) {
      supplier.name = name.trim();
    }

    if (contactPerson !== undefined) {
      supplier.contactPerson =
        contactPerson.trim();
    }

    if (email !== undefined) {
      supplier.email =
        email.trim().toLowerCase();
    }

    if (phone !== undefined) {
      supplier.phone = phone.trim();
    }

    if (address !== undefined) {
      supplier.address = address.trim();
    }

    if (city !== undefined) {
      supplier.city = city.trim();
    }

    if (postcode !== undefined) {
      supplier.postcode = postcode.trim();
    }

    if (country !== undefined) {
      supplier.country = country.trim();
    }

    if (notes !== undefined) {
      supplier.notes = notes.trim();
    }

    if (typeof status === "boolean") {
      supplier.status = status;
    }

    await supplier.save();

    res.status(200).json({
      message: "Supplier updated successfully",
      supplier,
    });

  } catch (error) {
    console.error("Update Supplier Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE SUPPLIER STATUS
// PATCH /api/suppliers/:id/status
// ==========================================

export const updateSupplierStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({
        message: "Status must be true or false",
      });
    }

    const supplier = await Supplier.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    supplier.status = status;

    await supplier.save();

    res.status(200).json({
      message:
        "Supplier status updated successfully",

      supplier,
    });

  } catch (error) {
    console.error(
      "Update Supplier Status Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// DELETE SUPPLIER
// DELETE /api/suppliers/:id
// ==========================================

export const deleteSupplier = async (
  req,
  res
) => {
  try {
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    await supplier.deleteOne();

    res.status(200).json({
      message: "Supplier deleted successfully",
    });

  } catch (error) {
    console.error("Delete Supplier Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};