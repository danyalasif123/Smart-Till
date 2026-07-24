import { useEffect, useState } from "react";
import "./ProductModal.css";

import Button from "../common/Button/Button";
import Input from "../common/Input/Input";

import {
  createProduct,
  updateProduct,
} from "../../services/productService";

import { getCategories } from "../../services/categoryService";

const ProductModal = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  product = null,
}) => {
  const initialState = {
    name: "",
    categoryId: "",
    sku: "",
    barcode: "",
    costPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    lowStockLevel: "5",
    unit: "piece",
    taxRate: "0",
    status: true,
  };

  const [formData, setFormData] = useState(initialState);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] =
    useState(false);

  // ==========================================
  // LOAD FORM + CATEGORIES
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    fetchCategories();

    if (mode === "edit" && product) {
      setFormData({
        name: product.name || "",

        categoryId:
          product.categoryId?._id ||
          product.categoryId ||
          "",

        sku: product.sku || "",

        barcode: product.barcode || "",

        costPrice:
          product.costPrice ?? "",

        sellingPrice:
          product.sellingPrice ?? "",

        stockQuantity:
          product.stockQuantity ?? "",

        lowStockLevel:
          product.lowStockLevel ?? 5,

        unit:
          product.unit || "piece",

        taxRate:
          product.taxRate ?? 0,

        status:
          typeof product.status === "boolean"
            ? product.status
            : true,
      });
    } else {
      setFormData(initialState);
    }
  }, [isOpen, mode, product]);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await getCategories();

      // Only active categories should be available
      // when creating/editing products.
      const activeCategories = (
        response.categories || []
      ).filter((category) => category.status);

      setCategories(activeCategories);
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );

      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  // ==========================================
  // HANDLE CHANGE
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
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Product name is required.");
      return false;
    }

    if (!formData.categoryId) {
      alert("Please select a category.");
      return false;
    }

    if (
      formData.sellingPrice === "" ||
      Number(formData.sellingPrice) < 0
    ) {
      alert(
        "Please enter a valid selling price."
      );

      return false;
    }

    if (
      formData.costPrice !== "" &&
      Number(formData.costPrice) < 0
    ) {
      alert(
        "Cost price cannot be negative."
      );

      return false;
    }

    if (
      formData.stockQuantity !== "" &&
      Number(formData.stockQuantity) < 0
    ) {
      alert(
        "Stock quantity cannot be negative."
      );

      return false;
    }

    if (
      formData.lowStockLevel !== "" &&
      Number(formData.lowStockLevel) < 0
    ) {
      alert(
        "Low stock level cannot be negative."
      );

      return false;
    }

    if (
      formData.taxRate !== "" &&
      Number(formData.taxRate) < 0
    ) {
      alert(
        "Tax rate cannot be negative."
      );

      return false;
    }

    return true;
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name.trim(),

        categoryId: formData.categoryId,

        sku: formData.sku.trim(),

        barcode: formData.barcode.trim(),

        costPrice:
          formData.costPrice === ""
            ? 0
            : Number(formData.costPrice),

        sellingPrice:
          Number(formData.sellingPrice),

        stockQuantity:
          formData.stockQuantity === ""
            ? 0
            : Number(formData.stockQuantity),

        lowStockLevel:
          formData.lowStockLevel === ""
            ? 5
            : Number(formData.lowStockLevel),

        unit:
          formData.unit.trim() || "piece",

        taxRate:
          formData.taxRate === ""
            ? 0
            : Number(formData.taxRate),

        status: formData.status,
      };

      // CREATE
      if (mode === "create") {
        await createProduct(productData);
      }

      // EDIT
      else {
        await updateProduct(
          product._id,
          productData
        );
      }

      await onSuccess();

      setFormData(initialState);

      onClose();
    } catch (error) {
      console.error(
        "Product Save Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          `Failed to ${
            mode === "create"
              ? "create"
              : "update"
          } product.`
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    setFormData(initialState);
    onClose();
  };

  return (
    <div className="product-modal-overlay">
      <div className="product-modal">

        {/* Header */}

        <div className="product-modal-header">
          <h2>
            {mode === "create"
              ? "Create Product"
              : "Edit Product"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Product Information */}

          <div className="product-form-section">
            <h3>Product Information</h3>

            <div className="product-form-grid">

              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />

              {/* Category */}

              <div className="product-form-group">
                <label htmlFor="categoryId">
                  Category
                </label>

                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="product-select"
                  required
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select category"}
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <Input
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. WH-001"
              />

              <Input
                label="Barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Enter or scan barcode"
              />

            </div>
          </div>

          {/* Pricing */}

          <div className="product-form-section">
            <h3>Pricing</h3>

            <div className="product-form-grid">

              <Input
                label="Cost Price"
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />

              <Input
                label="Selling Price"
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />

              <Input
                label="Tax Rate (%)"
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
              />

            </div>
          </div>

          {/* Inventory */}

          <div className="product-form-section">
            <h3>Inventory</h3>

            <div className="product-form-grid">

              <Input
                label="Stock Quantity"
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />

              <Input
                label="Low Stock Level"
                type="number"
                name="lowStockLevel"
                value={formData.lowStockLevel}
                onChange={handleChange}
                placeholder="5"
                min="0"
              />

              <Input
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="piece, kg, litre, box..."
              />

            </div>
          </div>

          {/* Status */}

          <div className="product-checkbox-group">
            <input
              id="product-status"
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />

            <label htmlFor="product-status">
              Active
            </label>
          </div>

          {/* Footer */}

          <div className="product-modal-footer">

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
              disabled={
                loading ||
                categoriesLoading
              }
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Product"
                : "Update Product"}
            </Button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default ProductModal;