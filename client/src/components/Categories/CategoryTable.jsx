import "./CategoryTable.css";
import Badge from "../common/Badge/Badge";

const CategoryTable = ({
  categories = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="category-table-message">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="category-table-message">
        No categories found.
      </div>
    );
  }

  return (
    <div className="category-table">
      {/* Table Header */}
      <div className="category-table-header">
        <div>NAME</div>
        <div>DESCRIPTION</div>
        <div>STATUS</div>
        <div>ACTIONS</div>
      </div>

      {/* Table Rows */}
      {categories.map((category) => (
        <div
          className="category-table-row"
          key={category._id}
        >
          {/* Name */}
          <div className="category-table-cell category-name">
            {category.name}
          </div>

          {/* Description */}
          <div className="category-table-cell category-description">
            {category.description || "-"}
          </div>

          {/* Status */}
          <div className="category-table-cell">
            <Badge status={category.status} />
          </div>

          {/* Actions */}
          <div className="category-table-cell category-actions">
            <button
              type="button"
              className="category-edit-btn"
              onClick={() => onEdit(category)}
            >
              EDIT
            </button>

            <button
              type="button"
              className="category-delete-btn"
              onClick={() => onDelete(category)}
            >
              DELETE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryTable;