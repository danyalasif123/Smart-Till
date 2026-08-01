import {
  formatCurrency,
  formatText,
} from "../../utils/reportFormatters";

const LowStockReport = ({
  report,
}) => {
  const summary =
    report?.summary || {};

  return (
    <>

      <div className="report-summary-grid">

        <div className="report-summary-card">
          <span>
            Need Attention
          </span>

          <strong>
            {summary.productsNeedingAttention ||
              0}
          </strong>

          <small>
            Products requiring restock
          </small>
        </div>


        <div className="report-summary-card">
          <span>Low Stock</span>

          <strong>
            {summary.lowStockProducts ||
              0}
          </strong>

          <small>
            Below stock threshold
          </small>
        </div>


        <div className="report-summary-card">
          <span>Out of Stock</span>

          <strong>
            {summary.outOfStockProducts ||
              0}
          </strong>

          <small>
            Products with zero stock
          </small>
        </div>


        <div className="report-summary-card">
          <span>Reorder Cost</span>

          <strong>
            {formatCurrency(
              summary.estimatedReorderCost
            )}
          </strong>

          <small>
            Estimated restocking cost
          </small>
        </div>

      </div>


      <div className="report-financial-summary">

        <div>
          <span>
            Suggested Reorder Units
          </span>

          <strong>
            {summary.suggestedReorderUnits ||
              0}
          </strong>
        </div>

        <div>
          <span>
            Products Affected
          </span>

          <strong>
            {summary.productsNeedingAttention ||
              0}
          </strong>
        </div>

        <div>
          <span>
            Estimated Cost
          </span>

          <strong>
            {formatCurrency(
              summary.estimatedReorderCost
            )}
          </strong>
        </div>

      </div>


      <div className="report-section">

        <div className="report-section-header">
          <h2>
            Products Requiring Restock
          </h2>

          <span>
            Products at or below their
            low-stock threshold
          </span>
        </div>


        <div className="low-stock-report-wrapper">

          <div className="low-stock-report-header">
            <div>Product</div>
            <div>Category</div>
            <div>Current</div>
            <div>Low Level</div>
            <div>Reorder</div>
            <div>Unit Cost</div>
            <div>Reorder Cost</div>
            <div>Status</div>
          </div>


          {report.products
            ?.length > 0 ? (

            report.products.map(
              (product) => (

                <div
                  className="low-stock-report-row"
                  key={product.productId}
                >

                  <div>
                    <strong>
                      {product.name}
                    </strong>

                    <span className="inventory-product-sku">
                      {product.sku ||
                        "-"}
                    </span>
                  </div>

                  <div>
                    {product.category}
                  </div>

                  <div>
                    <strong>
                      {
                        product.stockQuantity
                      }
                    </strong>{" "}
                    {product.unit}
                  </div>

                  <div>
                    {
                      product.lowStockLevel
                    }
                  </div>

                  <div className="reorder-quantity">
                    {
                      product.suggestedReorder
                    }
                  </div>

                  <div>
                    {formatCurrency(
                      product.costPrice
                    )}
                  </div>

                  <div>
                    {formatCurrency(
                      product.estimatedReorderCost
                    )}
                  </div>

                  <div>
                    <span
                      className={`inventory-status ${product.stockStatus}`}
                    >
                      {formatText(
                        product.stockStatus
                      )}
                    </span>
                  </div>

                </div>

              )
            )

          ) : (

            <div className="low-stock-empty">
              <strong>
                Stock levels look good
              </strong>

              <span>
                No products are currently
                at or below their low-stock
                level.
              </span>
            </div>

          )}

        </div>

      </div>

    </>
  );
};

export default LowStockReport;