import Category from "../models/Category.js";


// ==========================================
// CREATE CATEGORY
// POST /api/categories
// ==========================================

export const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Validate category name
    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    // Check if category already exists
    // inside the same business
    const existingCategory = await Category.findOne({
      businessId: req.user.businessId,
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    // Create category
    const category = await Category.create({
      name: name.trim(),

      description: description
        ? description.trim()
        : "",

      businessId: req.user.businessId,

      createdBy: req.user.id,

      status:
        typeof status === "boolean"
          ? status
          : true,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });

  } catch (error) {
    console.error("Create Category Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL CATEGORIES
// GET /api/categories
// ==========================================

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      businessId: req.user.businessId,
    })
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      count: categories.length,
      categories,
    });

  } catch (error) {
    console.error("Get Categories Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET CATEGORY BY ID
// GET /api/categories/:id
// ==========================================

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    }).populate(
      "createdBy",
      "name email"
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      category,
    });

  } catch (error) {
    console.error("Get Category Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE CATEGORY
// PUT /api/categories/:id
// ==========================================

export const updateCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
    } = req.body;

    // Find category belonging to
    // logged-in user's business
    const category = await Category.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Validate name
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        message: "Category name cannot be empty",
      });
    }

    // If category name is being changed,
    // check for duplicate category
    if (
      name &&
      name.trim().toLowerCase() !==
        category.name.toLowerCase()
    ) {
      const existingCategory =
        await Category.findOne({
          businessId: req.user.businessId,

          name: name.trim(),

          _id: {
            $ne: req.params.id,
          },
        });

      if (existingCategory) {
        return res.status(400).json({
          message:
            "Another category with this name already exists",
        });
      }
    }

    // Update fields
    if (name !== undefined) {
      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description =
        description.trim();
    }

    if (typeof status === "boolean") {
      category.status = status;
    }

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });

  } catch (error) {
    console.error("Update Category Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE CATEGORY STATUS
// PATCH /api/categories/:id/status
// ==========================================

export const updateCategoryStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    // Status must be true or false
    if (typeof status !== "boolean") {
      return res.status(400).json({
        message:
          "Status must be true or false",
      });
    }

    const category = await Category.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    category.status = status;

    await category.save();

    res.status(200).json({
      message:
        "Category status updated successfully",

      category,
    });

  } catch (error) {
    console.error(
      "Update Category Status Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// DELETE CATEGORY
// DELETE /api/categories/:id
// ==========================================

export const deleteCategory = async (
  req,
  res
) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      businessId: req.user.businessId,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message:
        "Category deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Category Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};