import { useEffect, useState } from "react";
import "./CategoryModal.css";

import Button from "../common/Button/Button";
import Input from "../common/Input/Input";

import {
  createCategory,
  updateCategory,
} from "../../services/categoryService";

const CategoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  category = null,
}) => {
  const initialState = {
    name: "",
    description: "",
    status: true,
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // SET FORM DATA
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    // EDIT MODE
    if (mode === "edit" && category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        status:
          typeof category.status === "boolean"
            ? category.status
            : true,
      });
    } else {
      // CREATE MODE
      setFormData(initialState);
    }
  }, [isOpen, mode, category]);

  // Don't render modal when closed
  if (!isOpen) {
    return null;
  }

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((previousData) => ({
      ...previousData,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      alert("Category name is required.");
      return;
    }

    try {
      setLoading(true);

      // CREATE
      if (mode === "create") {
        await createCategory({
          name: formData.name.trim(),

          description:
            formData.description.trim(),

          status: formData.status,
        });
      }

      // EDIT
      else {
        await updateCategory(
          category._id,
          {
            name: formData.name.trim(),

            description:
              formData.description.trim(),

            status: formData.status,
          }
        );
      }

      // Refresh categories
      await onSuccess();

      // Reset form
      setFormData(initialState);

      // Close modal
      onClose();

    } catch (error) {
      console.error(
        "Category Save Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          `Failed to ${
            mode === "create"
              ? "create"
              : "update"
          } category.`
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE CANCEL
  // ==========================================

  const handleCancel = () => {
    setFormData(initialState);

    onClose();
  };

  return (
    <div className="category-modal-overlay">

      <div className="category-modal">

        {/* =========================
            HEADER
        ========================= */}

        <div className="category-modal-header">

          <h2>
            {mode === "create"
              ? "Create Category"
              : "Edit Category"}
          </h2>

        </div>

        {/* =========================
            FORM
        ========================= */}

        <form onSubmit={handleSubmit}>

          {/* Category Name */}

          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />

          {/* Description */}

          <div className="category-form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows="4"
              className="category-textarea"
            />

          </div>

          {/* Status */}

          <div className="category-checkbox-group">

            <input
              id="category-status"
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />

            <label htmlFor="category-status">
              Active
            </label>

          </div>

          {/* =========================
              FOOTER
          ========================= */}

          <div className="category-modal-footer">

            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Category"
                : "Update Category"}
            </Button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CategoryModal;