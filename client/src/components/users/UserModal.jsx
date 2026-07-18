import { useEffect, useState } from "react";
import "./UserModal.css";

import Button from "../common/Button/Button";
import Input from "../common/Input/Input";

import { createUser, updateUser } from "../../services/userService";

const UserModal = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "create",
  user = null,
}) => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    role: "manager",
    status: true,
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        role: user.role || "manager",
        status: user.status,
      });
    } else {
      setFormData(initialState);
    }
  }, [isOpen, mode, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (mode === "create") {
        await createUser(formData);
      } else {
        const payload = { ...formData };

        // Don't update password if left blank
        if (!payload.password) {
          delete payload.password;
        }

        await updateUser(user._id, payload);
      }

      onSuccess();

      setFormData(initialState);

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          `Failed to ${mode === "create" ? "create" : "update"} user.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="user-modal">
        <div className="modal-header">
          <h2>
            {mode === "create" ? "Create User" : "Edit User"}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />

          <Input
            label={
              mode === "create"
                ? "Password"
                : "Password (Leave blank to keep current password)"
            }
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required={mode === "create"}
          />

          <div className="form-group">
            <label htmlFor="role">Role</label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="select-input"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>

          <div className="checkbox-group">
            <input
              id="status"
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />

            <label htmlFor="status">Active</label>
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData(initialState);
                onClose();
              }}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create User"
                : "Update User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;