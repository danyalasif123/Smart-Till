import {
  formatCurrency,
} from "../../utils/reportFormatters";

const ProductReport = ({
  report,
}) => {
  const summary =
    report?.summary || {};

  return (
    <>

      <div className="report-summary-grid">

        <div className="report-summary-card">
          <span>Products Sold</span>

          <strong>
            {summary.productsSold || 0}
          </strong>

          <small>
            Unique products sold
          </small>
        </div>


        <div className="report-summary-card">
          <span>Units Sold</span>

          <strong>
            {summary.totalUnitsSold || 0}
          </strong>

          <small>
            Total quantity sold
          </small>
        </div>


        <div className="report-summary-card">
          <span>Revenue</span>

          <strong>
            {formatCurrency(
              summary.totalRevenue
            )}
          </strong>

          <small>
            Product sales revenue
          </small>
        </div>


        <div className="report-summary-card">
          <span>
            Estimated Profit
          </span>

          <strong>
            {formatCurrency(
              summary.estimatedProfit
            )}
          </strong>

          <small>
            Revenue minus estimated cost
          </small>
        </div>

      </div>


      <div className="report-financial-summary">

        <div>
          <span>
            Estimated Cost
          </span>

          <strong>
            {formatCurrency(
              summary.estimatedCost
            )}
          </strong>
        </div>

        <div>
          <span>
            Avg Revenue / Unit
          </span>

          <strong>
            {formatCurrency(
              summary.averageRevenuePerUnit
            )}
          </strong>
        </div>

        <div>
          <span>
            Products With No Sales
          </span>

          <strong>
            {summary.productsWithNoSales ||
              0}
          </strong>
        </div>

      </div>


      {/* PERFORMANCE */}

      <div className="report-section">

        <div className="report-section-header">
          <h2>
            Product Performance
          </h2>

          <span>
            Sales performance for the
            selected period
          </span>
        </div>


        <div className="product-report-wrapper">

          <div className="product-report-header">
            <div>Product</div>
            <div>Category</div>
            <div>Units</div>
            <div>Orders</div>
            <div>Revenue</div>
            <div>Cost</div>
            <div>Profit</div>
            <div>Stock</div>
          </div>


          {report.productPerformance
            ?.length > 0 ? (

            report.productPerformance.map(
              (product) => (

                <div
                  className="product-report-row"
                  key={product.productId}
                >

                  <div>
                    <strong>
                      {product.name}
                    </strong>

                    <span className="product-report-sku">
                      {product.sku ||
                        "-"}
                    </span>
                  </div>

                  <div>
                    {product.category}
                  </div>

                  <div>
                    {product.quantitySold}
                  </div>

                  <div>
                    {product.orders}
                  </div>

                  <div>
                    {formatCurrency(
                      product.revenue
                    )}
                  </div>

                  <div>
                    {formatCurrency(
                      product.estimatedCost
                    )}
                  </div>

                  <div
                    className={
                      product.estimatedProfit >=
                      0
                        ? "product-profit-positive"
                        : "product-profit-negative"
                    }
                  >
                    {formatCurrency(
                      product.estimatedProfit
                    )}
                  </div>

                  <div>
                    {
                      product.stockQuantity
                    }
                  </div>

                </div>

              )
            )

          ) : (

            <div className="report-table-empty">
              No product sales found for
              this period.
            </div>

          )}

        </div>

      </div>


      {/* NO SALES */}

      <div className="report-section">

        <div className="report-section-header">
          <h2>
            Products With No Sales
          </h2>

          <span>
            Products that did not sell
            during this period
          </span>
        </div>


        <div className="no-sales-products">

          {report.productsWithNoSales
            ?.length > 0 ? (

            report.productsWithNoSales.map(
              (product) => (

                <div
                  className="no-sales-product"
                  key={product.productId}
                >

                  <div>
                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.sku ||
                        "-"}
                    </span>
                  </div>


                  <div>
                    <span>Stock</span>

                    <strong>
                      {
                        product.stockQuantity
                      }
                    </strong>
                  </div>


                  <div>
                    <span>Price</span>

                    <strong>
                      {formatCurrency(
                        product.sellingPrice
                      )}
                    </strong>
                  </div>

                </div>

              )
            )

          ) : (

            <div className="report-empty">
              Every active product has
              sales during this period.
            </div>

          )}

        </div>

      </div>

    </>
  );
};

export default ProductReport;