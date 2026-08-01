import "./LowStockProducts.css";

const LowStockProducts = ({
  products = [],
}) => {

  return (

    <div className="low-stock-card">

      <div className="low-stock-header">

        <h2>
          Low Stock Products
        </h2>

      </div>

      {products.length === 0 ? (

        <div className="low-stock-empty">

          Healthy Stocks

        </div>

      ) : (

        products.map((product) => (

          <div
            className="low-stock-row"
            key={product._id}
          >

            <div>

              <strong>
                {product.name}
              </strong>

              <p>
                {product.categoryId?.name ||
                  "No Category"}
              </p>

            </div>

            <div className="low-stock-right">

              <span className="stock-badge">

                {product.stockQuantity}

              </span>

            </div>

          </div>

        ))

      )}

    </div>

  );

};

export default LowStockProducts;