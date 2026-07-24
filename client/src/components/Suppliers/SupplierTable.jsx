import "./SupplierTable.css";
import Badge from "../common/Badge/Badge";

const SupplierTable = ({
  suppliers = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="supplier-table-message">
        Loading suppliers...
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="supplier-table-message">
        No suppliers found.
      </div>
    );
  }

  return (
    <div className="supplier-table-wrapper">
      <div className="supplier-table">

        {/* Header */}
        <div className="supplier-table-header">
          <div>Supplier</div>
          <div>Contact</div>
          <div>Phone</div>
          <div>Email</div>
          <div>Location</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Rows */}
        {suppliers.map((supplier) => (
          <div
            className="supplier-table-row"
            key={supplier._id}
          >
            {/* Supplier Name */}
            <div className="supplier-table-cell supplier-name">
              {supplier.name}
            </div>

            {/* Contact Person */}
            <div className="supplier-table-cell">
              {supplier.contactPerson || "-"}
            </div>

            {/* Phone */}
            <div className="supplier-table-cell">
              {supplier.phone || "-"}
            </div>

            {/* Email */}
            <div
              className="supplier-table-cell supplier-email"
              title={supplier.email || ""}
            >
              {supplier.email || "-"}
            </div>

            {/* Location */}
            <div className="supplier-table-cell">
              {supplier.city || supplier.country || "-"}
            </div>

            {/* Status */}
            <div className="supplier-table-cell">
              <Badge status={supplier.status} />
            </div>

            {/* Actions */}
            <div className="supplier-table-cell supplier-actions">

              <button
                type="button"
                className="supplier-edit-btn"
                onClick={() => onEdit(supplier)}
              >
                Edit
              </button>

              <button
                type="button"
                className="supplier-delete-btn"
                onClick={() => onDelete(supplier)}
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default SupplierTable;