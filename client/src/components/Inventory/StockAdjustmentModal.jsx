import { useEffect, useState } from "react";
import "./StockAdjustmentModal.css";

import {
  adjustStock,
} from "../../services/inventoryService";

const StockAdjustmentModal = ({
  isOpen,
  product,
  onClose,
  onSuccess,
}) => {
  // ==========================================
  // STATE
  // ==========================================

  const [formData, setFormData] = useState({
    type: "purchase",
    quantity: "",
    reference: "",
    notes: "",
  });

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // RESET WHEN MODAL OPENS
  // ==========================================

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: "purchase",
        quantity: "",
        reference: "",
        notes: "",
      });
    }
  }, [isOpen, product]);

  // ==========================================
  // DON'T RENDER IF CLOSED
  // ==========================================

  if (!isOpen || !product) {
    return null;
  }

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quantity =
      Number(formData.quantity);

    if (
      Number.isNaN(quantity) ||
      quantity <= 0
    ) {
      alert(
        "Quantity must be greater than 0."
      );

      return;
    }

    try {
      setLoading(true);

      // ======================================
      // QUANTITY DIRECTION
      //
      // purchase  -> backend makes positive
      // opening   -> backend makes positive
      // return    -> backend makes positive
      // damage    -> backend makes negative
      //
      // adjustment:
      // user chooses whether stock is
      // added or removed below.
      // ======================================

      let quantityChange =
        quantity;

      if (
        formData.type ===
        "adjustment_remove"
      ) {
        quantityChange =
          -quantity;
      }

      let transactionType =
        formData.type;

      if (
        formData.type ===
          "adjustment_add" ||
        formData.type ===
          "adjustment_remove"
      ) {
        transactionType =
          "adjustment";
      }

      const data = {
        productId:
          product._id,

        type:
          transactionType,

        quantity:
          quantityChange,

        reference:
          formData.reference.trim(),

        notes:
          formData.notes.trim(),
      };

      const response =
        await adjustStock(data);

      alert(
        response.message ||
          "Stock updated successfully."
      );

      // Refresh inventory page
      await onSuccess?.();

      onClose();

    } catch (error) {
      console.error(
        "Adjust Stock Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update stock."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CURRENT STOCK
  // ==========================================

  const currentStock =
    Number(
      product.stockQuantity || 0
    );

  // ==========================================
  // PREVIEW NEW STOCK
  // ==========================================

  const enteredQuantity =
    Number(formData.quantity || 0);

  let previewStock =
    currentStock;

  if (
    formData.type === "damage" ||
    formData.type ===
      "adjustment_remove"
  ) {
    previewStock =
      currentStock -
      enteredQuantity;
  } else {
    previewStock =
      currentStock +
      enteredQuantity;
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="stock-modal-overlay">

      <div className="stock-modal">

        {/* HEADER */}

        <div className="stock-modal-header">

          <div>
            <h2>
              Adjust Stock
            </h2>

            <p>
              Add or remove inventory
              for this product.
            </p>
          </div>

          <button
            type="button"
            className="stock-modal-close"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>

        </div>

        {/* PRODUCT */}

        <div className="stock-product-info">

          <div>
            <span>Product</span>

            <strong>
              {product.name}
            </strong>
          </div>

          <div>
            <span>SKU</span>

            <strong>
              {product.sku || "-"}
            </strong>
          </div>

          <div>
            <span>
              Current Stock
            </span>

            <strong>
              {currentStock}{" "}
              {product.unit ||
                "piece"}
            </strong>
          </div>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="stock-adjustment-form"
        >

          {/* TYPE */}

          <div className="stock-form-group">

            <label>
              Adjustment Type
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="purchase">
                Stock Received
              </option>

              <option value="return">
                Customer Return
              </option>

              <option value="damage">
                Damaged Stock
              </option>

              <option value="adjustment_add">
                Manual Stock Increase
              </option>

              <option value="adjustment_remove">
                Manual Stock Decrease
              </option>

              <option value="opening">
                Opening Stock
              </option>
            </select>

          </div>

          {/* QUANTITY */}

          <div className="stock-form-group">

            <label>
              Quantity
            </label>

            <input
              type="number"
              name="quantity"
              min="1"
              step="1"
              placeholder="Enter quantity"
              value={
                formData.quantity
              }
              onChange={handleChange}
              required
            />

          </div>

          {/* STOCK PREVIEW */}

          {enteredQuantity > 0 && (
            <div
              className={`stock-preview ${
                previewStock < 0
                  ? "invalid"
                  : ""
              }`}
            >
              <span>
                Stock after adjustment
              </span>

              <strong>
                {currentStock}
                {" → "}
                {previewStock}
                {" "}
                {product.unit ||
                  "piece"}
              </strong>
            </div>
          )}

          {/* REFERENCE */}

          <div className="stock-form-group">

            <label>
              Reference
            </label>

            <input
              type="text"
              name="reference"
              placeholder="e.g. DELIVERY-001"
              value={
                formData.reference
              }
              onChange={handleChange}
            />

          </div>

          {/* NOTES */}

          <div className="stock-form-group">

            <label>
              Notes
            </label>

            <textarea
              name="notes"
              rows="3"
              placeholder="Optional notes..."
              value={formData.notes}
              onChange={handleChange}
            />

          </div>

          {/* ACTIONS */}

          <div className="stock-modal-actions">

            <button
              type="button"
              className="stock-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="stock-save-btn"
              disabled={
                loading ||
                previewStock < 0
              }
            >
              {loading
                ? "Updating..."
                : "Update Stock"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default StockAdjustmentModal;