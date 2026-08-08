import {
  formatCurrency,
  formatDate,
  formatText,
} from "../../utils/reportFormatters";

const PurchaseReport = ({ report }) => {
  const purchases = report?.purchases || [];

  // =========================================
  // FALLBACK CALCULATIONS
  // =========================================

  const calculatedTotal = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.total || 0),
    0
  );

  const calculatedSubtotal = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.subtotal || 0),
    0
  );

  const calculatedDiscount = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.discount || 0),
    0
  );

  const calculatedTax = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.tax || 0),
    0
  );

  const calculatedItems = purchases.reduce(
    (sum, purchase) =>
      sum + Number(purchase.totalItems || 0),
    0
  );

  // =========================================
  // SUMMARY WITH FALLBACKS
  // =========================================

  const summary = {
    totalPurchases:
      report?.summary?.totalPurchases > 0
        ? report.summary.totalPurchases
        : calculatedTotal,

    totalTransactions:
      report?.summary?.totalTransactions > 0
        ? report.summary.totalTransactions
        : purchases.length,

    averagePurchase:
      report?.summary?.averagePurchase > 0
        ? report.summary.averagePurchase
        : purchases.length > 0
        ? calculatedTotal / purchases.length
        : 0,

    totalItems:
      report?.summary?.totalItems > 0
        ? report.summary.totalItems
        : calculatedItems,

    subtotal:
      report?.summary?.subtotal > 0
        ? report.summary.subtotal
        : calculatedSubtotal,

    discount:
      report?.summary?.discount > 0
        ? report.summary.discount
        : calculatedDiscount,

    tax:
      report?.summary?.tax > 0
        ? report.summary.tax
        : calculatedTax,
  };

  return (
    <>

      {/* SUMMARY */}

      <div className="report-summary-grid">

        <div className="report-summary-card">
          <span>Total Purchases</span>

          <strong>
            {formatCurrency(
              summary.totalPurchases
            )}
          </strong>

          <small>
            Purchase value in selected period
          </small>
        </div>


        <div className="report-summary-card">
          <span>Transactions</span>

          <strong>
            {summary.totalTransactions}
          </strong>

          <small>
            Purchase orders created
          </small>
        </div>


        <div className="report-summary-card">
          <span>Average Purchase</span>

          <strong>
            {formatCurrency(
              summary.averagePurchase
            )}
          </strong>

          <small>
            Average purchase order value
          </small>
        </div>


        <div className="report-summary-card">
          <span>Items Purchased</span>

          <strong>
            {summary.totalItems}
          </strong>

          <small>
            Total product units purchased
          </small>
        </div>

      </div>


      {/* FINANCIAL */}

      <div className="report-financial-summary">

        <div>
          <span>Subtotal</span>

          <strong>
            {formatCurrency(summary.subtotal)}
          </strong>
        </div>


        <div>
          <span>Discounts</span>

          <strong>
            {formatCurrency(summary.discount)}
          </strong>
        </div>


        <div>
          <span>Tax</span>

          <strong>
            {formatCurrency(summary.tax)}
          </strong>
        </div>

      </div>


      {/* SUPPLIER BREAKDOWN */}

      <div className="report-section">

        <div className="report-section-header">
          <h2>Supplier Breakdown</h2>

          <span>Purchases grouped by supplier</span>
        </div>


        {report.supplierBreakdown?.length > 0 ? (

          <div className="report-breakdown-list">

            {report.supplierBreakdown.map((item) => (

              <div
                className="report-breakdown-row"
                key={item.supplierId || item.supplierName}
              >

                <div>
                  <strong>
                    {item.supplierName}
                  </strong>

                  <span>
                    {item.transactions} purchases
                  </span>
                </div>

                <strong>
                  {formatCurrency(item.amount)}
                </strong>

              </div>

            ))}

          </div>

        ) : (

          <div className="report-empty">
            No supplier data available.
          </div>

        )}

      </div>


      {/* RECENT PURCHASES */}

      <div className="report-section">

        <div className="report-section-header">
          <h2>Recent Purchases</h2>

          <span>Latest supplier purchase orders</span>
        </div>


        <div className="report-sales-table">

          <div className="report-sales-header">
            <div>Purchase</div>
            <div>Date</div>
            <div>Supplier</div>
            <div>Items</div>
            <div>Reference</div>
            <div>Total</div>
          </div>


          {purchases.length > 0 ? (

            purchases.map((purchase) => (

              <div
                className="report-sales-row"
                key={purchase._id}
              >

                <div className="report-sale-number">
                  {purchase.purchaseNumber}
                </div>

                <div>
                  {formatDate(purchase.createdAt)}
                </div>

                <div>
                  {purchase.supplierId?.name || "-"}
                </div>

                <div>
                  {purchase.totalItems || 0}
                </div>

                <div>
                  {purchase.supplierReference || "-"}
                </div>

                <div className="report-money">
                  {formatCurrency(purchase.total)}
                </div>

              </div>

            ))

          ) : (

            <div className="report-table-empty">
              No purchases found.
            </div>

          )}

        </div>

      </div>

    </>
  );
};

export default PurchaseReport;