import { useEffect, useState } from "react";
import "./SupplierModal.css";

import Button from "../common/Button/Button";
import Input from "../common/Input/Input";

import {
  createSupplier,
  updateSupplier,
} from "../../services/supplierService";

const SupplierModal = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  supplier = null,
}) => {
  const initialState = {
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    notes: "",
    status: true,
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOAD SUPPLIER DATA
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && supplier) {
      setFormData({
        name: supplier.name || "",
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        city: supplier.city || "",
        postcode: supplier.postcode || "",
        country: supplier.country || "",
        notes: supplier.notes || "",
        status:
          typeof supplier.status === "boolean"
            ? supplier.status
            : true,
      });
    } else {
      setFormData(initialState);
    }
  }, [isOpen, mode, supplier]);

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

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Supplier name is required.");
      return;
    }

    try {
      setLoading(true);

      const supplierData = {
        name: formData.name.trim(),
        contactPerson: formData.contactPerson.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postcode: formData.postcode.trim(),
        country: formData.country.trim(),
        notes: formData.notes.trim(),
        status: formData.status,
      };

      if (mode === "create") {
        await createSupplier(supplierData);
      } else {
        await updateSupplier(
          supplier._id,
          supplierData
        );
      }

      await onSuccess();

      setFormData(initialState);

      onClose();
    } catch (error) {
      console.error(
        "Supplier Save Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          `Failed to ${
            mode === "create"
              ? "create"
              : "update"
          } supplier.`
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
    <div className="supplier-modal-overlay">
      <div className="supplier-modal">

        {/* Header */}

        <div className="supplier-modal-header">
          <h2>
            {mode === "create"
              ? "Create Supplier"
              : "Edit Supplier"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Basic Information */}

          <div className="supplier-form-section">
            <h3>Supplier Information</h3>

            <div className="supplier-form-grid">
              <Input
                label="Supplier Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter supplier name"
                required
              />

              <Input
                label="Contact Person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Address */}

          <div className="supplier-form-section">
            <h3>Address</h3>

            <div className="supplier-form-grid">
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />

              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />

              <Input
                label="Postcode / ZIP"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                placeholder="Postcode"
              />

              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
              />
            </div>
          </div>

          {/* Notes */}

          <div className="supplier-form-section">
            <h3>Additional Information</h3>

            <div className="supplier-form-group">
              <label htmlFor="supplier-notes">
                Notes
              </label>

              <textarea
                id="supplier-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter supplier notes..."
                rows="3"
                className="supplier-textarea"
              />
            </div>
          </div>

          {/* Status */}

          <div className="supplier-checkbox-group">
            <input
              id="supplier-status"
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />

            <label htmlFor="supplier-status">
              Active
            </label>
          </div>

          {/* Footer */}

          <div className="supplier-modal-footer">
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
                  ? "Create Supplier"
                  : "Update Supplier"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SupplierModal;