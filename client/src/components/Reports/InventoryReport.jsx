import {
  formatCurrency,
  formatText,
} from "../../utils/reportFormatters";

const InventoryReport = ({
  report,
}) => {
  const summary =
    report?.summary || {};

  return (
    <>

      <div className="report-summary-grid">

        <div className="report-summary-card">
          <span>Products</span>

          <strong>
            {summary.totalProducts || 0}
          </strong>

          <small>Total products</small>
        </div>


        <div className="report-summary-card">
          <span>Stock Units</span>

          <strong>
            {summary.totalStockQuantity ||
              0}
          </strong>

          <small>
            Units currently available
          </small>
        </div>


        <div className="report-summary-card">
          <span>Stock Cost</span>

          <strong>
            {formatCurrency(
              summary.stockCostValue
            )}
          </strong>

          <small>
            Current inventory cost
          </small>
        </div>


        <div className="report-summary-card">
          <span>Retail Value</span>

          <strong>
            {formatCurrency(
              summary.stockRetailValue
            )}
          </strong>

          <small>
            Potential sales value
          </small>
        </div>

      </div>


      <div className="report-financial-summary">

        <div>
          <span>
            Potential Profit
          </span>

          <strong>
            {formatCurrency(
              summary.potentialProfit
            )}
          </strong>
        </div>

        <div>
          <span>Low Stock</span>

          <strong>
            {summary.lowStockProducts ||
              0}
          </strong>
        </div>

        <div>
          <span>Out of Stock</span>

          <strong>
            {summary.outOfStockProducts ||
              0}
          </strong>
        </div>

      </div>


      <div className="report-section">

        <div className="report-section-header">
          <h2>Current Inventory</h2>

          <span>
            Current product stock and
            value
          </span>
        </div>


        <div className="inventory-report-wrapper">

          <div className="inventory-report-header">
            <div>Product</div>
            <div>Category</div>
            <div>Stock</div>
            <div>Cost</div>
            <div>Sell</div>
            <div>Cost Value</div>
            <div>Retail Value</div>
            <div>Status</div>
          </div>


          {report.inventory
            ?.length > 0 ? (

            report.inventory.map(
              (product) => (

                <div
                  className="inventory-report-row"
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
                    {product.stockQuantity}{" "}
                    {product.unit}
                  </div>

                  <div>
                    {formatCurrency(
                      product.costPrice
                    )}
                  </div>

                  <div>
                    {formatCurrency(
                      product.sellingPrice
                    )}
                  </div>

                  <div>
                    {formatCurrency(
                      product.costValue
                    )}
                  </div>

                  <div>
                    {formatCurrency(
                      product.retailValue
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

            <div className="report-table-empty">
              No inventory found.
            </div>

          )}

        </div>

      </div>

    </>
  );
};

export default InventoryReport;