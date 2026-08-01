import "./TopProducts.css";

const money = (value) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value || 0);

const TopProducts = ({
  products = [],
}) => {

  return (

    <div className="top-products-card">

      <div className="top-products-header">

        <h2>
          Top Selling Products
        </h2>

      </div>

      {products.length === 0 ? (

        <div className="top-products-empty">
          No sales today.
        </div>

      ) : (

        products.map((product) => (

          <div
            className="top-product-row"
            key={product.productId}
          >

            <div>

              <strong>
                {product.name}
              </strong>

              <p>
                {product.quantity} sold
              </p>

            </div>

            <strong>
              {money(product.revenue)}
            </strong>

          </div>

        ))

      )}

    </div>

  );

};

export default TopProducts;