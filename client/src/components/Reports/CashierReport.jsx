import {
  formatCurrency,
  formatDate,
  formatText,
} from "../../utils/reportFormatters";

const CashierReport = ({
  report,
}) => {
  const summary =
    report?.summary || {};

  return (
    <>

      <div className="report-summary-grid">

        <div className="report-summary-card">
          <span>
            Active Cashiers
          </span>

          <strong>
            {summary.activeCashiers ||
              0}
          </strong>

          <small>
            Staff who processed sales
          </small>
        </div>


        <div className="report-summary-card">
          <span>
            Sales Processed
          </span>

          <strong>
            {summary.totalSales || 0}
          </strong>

          <small>
            POS transactions
          </small>
        </div>


        <div className="report-summary-card">
          <span>
            Revenue Handled
          </span>

          <strong>
            {formatCurrency(
              summary.totalRevenue
            )}
          </strong>

          <small>
            Revenue processed by staff
          </small>
        </div>


        <div className="report-summary-card">
          <span>Items Sold</span>

          <strong>
            {summary.totalItemsSold || 0}
          </strong>

          <small>
            Product units processed
          </small>
        </div>

      </div>


      <div className="report-financial-summary">

        <div>
          <span>Average Sale</span>

          <strong>
            {formatCurrency(
              summary.averageSaleValue
            )}
          </strong>
        </div>


        <div>
          <span>
            Avg Items / Sale
          </span>

          <strong>
            {Number(
              summary.averageItemsPerSale ||
                0
            ).toFixed(2)}
          </strong>
        </div>


        <div>
          <span>Top Cashier</span>

          <strong>
            {report.topCashier?.name ||
              "-"}
          </strong>
        </div>

      </div>


      {/* PERFORMANCE */}

      <div className="report-section">

        <div className="report-section-header">
          <h2>
            Cashier Performance
          </h2>

          <span>
            POS performance during the
            selected period
          </span>
        </div>


        <div className="cashier-report-wrapper">

          <div className="cashier-report-header">
            <div>Cashier</div>
            <div>Role</div>
            <div>Sales</div>
            <div>Items</div>
            <div>Revenue</div>
            <div>Avg Sale</div>
            <div>Last Sale</div>
          </div>


          {report.cashierPerformance
            ?.length > 0 ? (

            report.cashierPerformance.map(
              (cashier) => (

                <div
                  className="cashier-report-row"
                  key={cashier.cashierId}
                >

                  <div>
                    <strong>
                      {cashier.name}
                    </strong>

                    <span className="cashier-report-email">
                      {cashier.email ||
                        "-"}
                    </span>
                  </div>


                  <div>
                    <span className="cashier-role-badge">
                      {formatText(
                        cashier.role
                      )}
                    </span>
                  </div>


                  <div>
                    {cashier.salesCount}
                  </div>

                  <div>
                    {cashier.itemsSold}
                  </div>

                  <div className="cashier-revenue">
                    {formatCurrency(
                      cashier.revenue
                    )}
                  </div>

                  <div>
                    {formatCurrency(
                      cashier.averageSaleValue
                    )}
                  </div>

                  <div>
                    {formatDate(
                      cashier.lastSaleAt
                    )}
                  </div>

                </div>

              )
            )

          ) : (

            <div className="report-table-empty">
              No cashier sales found for
              this period.
            </div>

          )}

        </div>

      </div>


      {/* PAYMENT BREAKDOWN */}

      <div className="report-section">

        <div className="report-section-header">
          <h2>
            Payment Breakdown
          </h2>

          <span>
            Payment methods processed by
            each cashier
          </span>
        </div>


        <div className="cashier-payment-grid">

          {report.cashierPerformance
            ?.length > 0 ? (

            report.cashierPerformance.map(
              (cashier) => (

                <div
                  className="cashier-payment-card"
                  key={`payment-${cashier.cashierId}`}
                >

                  <div className="cashier-payment-title">
                    <strong>
                      {cashier.name}
                    </strong>

                    <span>
                      {cashier.salesCount}{" "}
                      sales
                    </span>
                  </div>


                  <div className="cashier-payment-values">

                    <div>
                      <span>Cash</span>

                      <strong>
                        {cashier.cashSales}
                      </strong>
                    </div>

                    <div>
                      <span>Card</span>

                      <strong>
                        {cashier.cardSales}
                      </strong>
                    </div>

                    <div>
                      <span>Online</span>

                      <strong>
                        {
                          cashier.onlineSales
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Other</span>

                      <strong>
                        {cashier.otherSales}
                      </strong>
                    </div>

                  </div>

                </div>

              )
            )

          ) : (

            <div className="report-empty">
              No payment information
              available.
            </div>

          )}

        </div>

      </div>

    </>
  );
};

export default CashierReport;