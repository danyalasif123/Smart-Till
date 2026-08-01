import {
  formatCurrency,
  formatDate,
} from "../../utils/reportFormatters";

const CustomerReport = ({
  report,
}) => {
  const summary =
    report?.summary || {};

  return (
    <>

      <div className="report-summary-grid">

        <div className="report-summary-card">
          <span>Customers</span>

          <strong>
            {summary.customersWhoPurchased ||
              0}
          </strong>

          <small>
            Purchased during this period
          </small>
        </div>


        <div className="report-summary-card">
          <span>New Customers</span>

          <strong>
            {summary.newCustomers || 0}
          </strong>

          <small>
            Registered during this period
          </small>
        </div>


        <div className="report-summary-card">
          <span>
            Repeat Customers
          </span>

          <strong>
            {summary.repeatCustomers || 0}
          </strong>

          <small>
            Made 2 or more purchases
          </small>
        </div>


        <div className="report-summary-card">
          <span>
            Customer Revenue
          </span>

          <strong>
            {formatCurrency(
              summary.identifiedRevenue
            )}
          </strong>

          <small>
            Revenue from identified
            customers
          </small>
        </div>

      </div>


      <div className="report-financial-summary">

        <div>
          <span>
            Registered Customers
          </span>

          <strong>
            {summary.totalRegisteredCustomers ||
              0}
          </strong>
        </div>

        <div>
          <span>
            Customer Orders
          </span>

          <strong>
            {summary.identifiedSales ||
              0}
          </strong>
        </div>

        <div>
          <span>
            Avg Customer Spend
          </span>

          <strong>
            {formatCurrency(
              summary.averageCustomerSpend
            )}
          </strong>
        </div>

      </div>


      <div className="report-section">

        <div className="report-section-header">
          <h2>Top Customers</h2>

          <span>
            Ranked by spending during
            the selected period
          </span>
        </div>


        <div className="customer-report-wrapper">

          <div className="customer-report-header">
            <div>Customer</div>
            <div>Customer ID</div>
            <div>Orders</div>
            <div>Total Spent</div>
            <div>Avg Order</div>
            <div>Last Purchase</div>
          </div>


          {report.topCustomers
            ?.length > 0 ? (

            report.topCustomers.map(
              (customer) => (

                <div
                  className="customer-report-row"
                  key={
                    customer.customerId
                  }
                >

                  <div>
                    <strong>
                      {customer.name}
                    </strong>

                    <span className="customer-report-email">
                      {customer.email ||
                        customer.phone ||
                        "-"}
                    </span>
                  </div>

                  <div className="customer-report-number">
                    {
                      customer.customerNumber
                    }
                  </div>

                  <div>
                    {customer.orders}
                  </div>

                  <div>
                    {formatCurrency(
                      customer.spent
                    )}
                  </div>

                  <div>
                    {formatCurrency(
                      customer.averageOrderValue
                    )}
                  </div>

                  <div>
                    {formatDate(
                      customer.lastPurchaseAt
                    )}
                  </div>

                </div>

              )
            )

          ) : (

            <div className="report-table-empty">
              No customer purchases found
              for this period.
            </div>

          )}

        </div>

      </div>

    </>
  );
};

export default CustomerReport;