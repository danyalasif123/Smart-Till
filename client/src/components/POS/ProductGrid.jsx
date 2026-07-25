import "./ProductGrid.css";

const ProductGrid = ({
  products = [],
  loading = false,
  onAddProduct,
}) => {
  if (loading) {
    return (
      <div className="pos-product-message">
        Loading products...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="pos-product-message">
        No products found.
      </div>
    );
  }

  return (
    <div className="pos-product-grid">
      {products.map((product) => {
        const outOfStock =
          product.stockQuantity <= 0;

        return (
          <button
            type="button"
            key={product._id}
            className={`pos-product-card ${
              outOfStock
                ? "out-of-stock"
                : ""
            }`}
            disabled={outOfStock}
            onClick={() =>
              onAddProduct(product)
            }
          >
            <div className="pos-product-name">
              {product.name}
            </div>

            <div className="pos-product-sku">
              {product.sku || "No SKU"}
            </div>

            <div className="pos-product-card-bottom">
              <span className="pos-product-price">
                $
                {Number(
                  product.sellingPrice
                ).toFixed(2)}
              </span>

              <span
                className={`pos-product-stock ${
                  product.stockQuantity <=
                  product.lowStockLevel
                    ? "low"
                    : ""
                }`}
              >
                Stock:{" "}
                {product.stockQuantity}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ProductGrid;