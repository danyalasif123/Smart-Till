import { useEffect, useState } from "react";
import "./CustomerModal.css";

import Button from "../common/Button/Button";
import Input from "../common/Input/Input";

import {
  createCustomer,
  updateCustomer,
} from "../../services/customerService";

const CustomerModal = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  customer = null,
}) => {
  const initialState = {
    name: "",
    phone: "",
    email: "",
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
  // LOAD CUSTOMER FOR EDIT
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        city: customer.city || "",
        postcode: customer.postcode || "",
        country: customer.country || "",
        notes: customer.notes || "",
        status:
          typeof customer.status === "boolean"
            ? customer.status
            : true,
      });
    } else {
      setFormData(initialState);
    }
  }, [isOpen, mode, customer]);

  if (!isOpen) {
    return null;
  }

  // ==========================================
  // CHANGE
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
      alert("Customer name is required.");
      return;
    }

    try {
      setLoading(true);

      const customerData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postcode: formData.postcode.trim(),
        country: formData.country.trim(),
        notes: formData.notes.trim(),
        status: formData.status,
      };

      if (mode === "create") {
        await createCustomer(customerData);
      } else {
        await updateCustomer(
          customer._id,
          customerData
        );
      }

      await onSuccess();

      setFormData(initialState);

      onClose();
    } catch (error) {
      console.error(
        "Customer Save Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          `Failed to ${
            mode === "create"
              ? "create"
              : "update"
          } customer.`
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
    <div className="customer-modal-overlay">

      <div className="customer-modal">

        {/* HEADER */}

        <div className="customer-modal-header">
          <div>
            <h2>
              {mode === "create"
                ? "Create Customer"
                : "Edit Customer"}
            </h2>

            {mode === "edit" &&
              customer?.customerNumber && (
                <span className="customer-modal-number">
                  {customer.customerNumber}
                </span>
              )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* CUSTOMER INFORMATION */}

          <div className="customer-form-section">

            <h3>Customer Information</h3>

            <div className="customer-form-grid">

              <Input
                label="Customer Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />

            </div>

          </div>

          {/* ADDRESS */}

          <div className="customer-form-section">

            <h3>Address</h3>

            <div className="customer-form-grid">

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

          {/* NOTES */}

          <div className="customer-form-section">

            <h3>Additional Information</h3>

            <div className="customer-form-group">

              <label htmlFor="customer-notes">
                Notes
              </label>

              <textarea
                id="customer-notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter customer notes..."
                rows="3"
                className="customer-textarea"
              />

            </div>

          </div>

          {/* STATUS */}

          <div className="customer-checkbox-group">

            <input
              id="customer-status"
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />

            <label htmlFor="customer-status">
              Active
            </label>

          </div>

          {/* FOOTER */}

          <div className="customer-modal-footer">

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
                  ? "Create Customer"
                  : "Update Customer"}
            </Button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CustomerModal;