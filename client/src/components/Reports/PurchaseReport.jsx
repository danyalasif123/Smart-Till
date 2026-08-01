import {
  formatCurrency,
  formatPercent,
} from "../../utils/reportFormatters";

const ProfitReport = ({ report }) => {
  const summary =
    report?.summary || {};

  return (
    <>

      <div className="report-summary-grid">

        <div className="report-summary-card">
          <span>Revenue</span>

          <strong>
            {formatCurrency(
              summary.productRevenue
            )}
          </strong>

          <small>
            Product sales before discounts
          </small>
        </div>


        <div className="report-summary-card">
          <span>Cost of Goods</span>

          <strong>
            {formatCurrency(
              summary.cogs
            )}
          </strong>

          <small>
            Cost of products sold
          </small>
        </div>


        <div className="report-summary-card">
          <span>Gross Profit</span>

          <strong>
            {formatCurrency(
              summary.grossProfit
            )}
          </strong>

          <small>
            Revenue minus discount and
            product cost
          </small>
        </div>


        <div className="report-summary-card">
          <span>Profit Margin</span>

          <strong>
            {formatPercent(
              summary.profitMargin
            )}
          </strong>

          <small>
            Gross profit percentage
          </small>
        </div>

      </div>


      <div className="report-financial-summary">

        <div>
          <span>Discounts</span>

          <strong>
            {formatCurrency(
              summary.discount
            )}
          </strong>
        </div>

        <div>
          <span>Transactions</span>

          <strong>
            {summary.transactions || 0}
          </strong>
        </div>

        <div>
          <span>Items Sold</span>

          <strong>
            {summary.itemsSold || 0}
          </strong>
        </div>

      </div>


      <div className="report-section">

        <div className="report-section-header">
          <h2>
            Product Profitability
          </h2>

          <span>
            Revenue, cost and profit by
            product
          </span>
        </div>


        <div className="profit-table-wrapper">

          <div className="profit-table-header">
            <div>Product</div>
            <div>SKU</div>
            <div>Qty</div>
            <div>Revenue</div>
            <div>Cost</div>
            <div>Profit</div>
            <div>Margin</div>
          </div>


          {report.products
            ?.length > 0 ? (

            report.products.map(
              (product) => (

                <div
                  className="profit-table-row"
                  key={
                    product.productId ||
                    product.productName
                  }
                >

                  <div>
                    <strong>
                      {
                        product.productName
                      }
                    </strong>
                  </div>

                  <div>
                    {product.sku || "-"}
                  </div>

                  <div>
                    {product.quantitySold}
                  </div>

                  <div>
                    {formatCurrency(
                      product.revenue
                    )}
                  </div>

                  <div>
                    {formatCurrency(
                      product.cost
                    )}
                  </div>

                  <div className="profit-value">
                    {formatCurrency(
                      product.profit
                    )}
                  </div>

                  <div>
                    {formatPercent(
                      product.margin
                    )}
                  </div>

                </div>

              )
            )

          ) : (

            <div className="report-table-empty">
              No profit data found for
              this period.
            </div>

          )}

        </div>

      </div>

    </>
  );
};

export default ProfitReport;