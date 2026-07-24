    import "./ProductTable.css";
import Badge from "../common/Badge/Badge";

const ProductTable = ({
  products = [],
  loading = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="product-table-message">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-table-message">
        No products found.
      </div>
    );
  }

  return (
    <div className="product-table-wrapper">
      <div className="product-table">

        {/* Header */}
        <div className="product-table-header">
          <div>Product</div>
          <div>Category</div>
          <div>SKU</div>
          <div>Price</div>
          <div>Stock</div>
          <div>Unit</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Rows */}
        {products.map((product) => (
          <div
            className="product-table-row"
            key={product._id}
          >
            {/* Product Name */}
            <div className="product-table-cell product-name">
              {product.name}
            </div>

            {/* Category */}
            <div className="product-table-cell">
              {product.categoryId?.name || "-"}
            </div>

            {/* SKU */}
            <div className="product-table-cell product-sku">
              {product.sku || "-"}
            </div>

            {/* Selling Price */}
            <div className="product-table-cell product-price">
              £{Number(product.sellingPrice || 0).toFixed(2)}
            </div>

            {/* Stock */}
            <div className="product-table-cell">
              <span
                className={
                  product.stockQuantity <= product.lowStockLevel
                    ? "product-stock-low"
                    : "product-stock-normal"
                }
              >
                {product.stockQuantity ?? 0}
              </span>
            </div>

            {/* Unit */}
            <div className="product-table-cell">
              {product.unit || "-"}
            </div>

            {/* Status */}
            <div className="product-table-cell">
              <Badge status={product.status} />
            </div>

            {/* Actions */}
            <div className="product-table-cell product-actions">
              <button
                type="button"
                className="product-edit-btn"
                onClick={() => onEdit(product)}
              >
                Edit
              </button>

              <button
                type="button"
                className="product-delete-btn"
                onClick={() => onDelete(product)}
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

export default ProductTable;