// src/components/Reports/SalesReport.jsx

import {
  formatCurrency,
  formatDate,
  formatText,
} from "../../utils/reportFormatters";

const SalesReport = ({ report }) => {
  // ==========================================
  // RECENT SALES
  // ==========================================

  const sales = report?.recentSales || [];

  // ==========================================
  // CALCULATE SUMMARY IF BACKEND RETURNS 0
  // ==========================================

  const calculatedSummary = {
    totalSales: sales.reduce(
      (sum, sale) => sum + Number(sale.total || 0),
      0
    ),

    totalTransactions: sales.length,

    averageSale:
      sales.length > 0
        ? sales.reduce(
            (sum, sale) => sum + Number(sale.total || 0),
            0
          ) / sales.length
        : 0,

    totalItemsSold: sales.reduce(
      (sum, sale) =>
        sum +
        (sale.items
          ? sale.items.reduce(
              (itemSum, item) =>
                itemSum + Number(item.quantity || 0),
              0
            )
          : 0),
      0
    ),

    subtotal: sales.reduce(
      (sum, sale) =>
        sum + Number(sale.subtotal || sale.total || 0),
      0
    ),

    discount: sales.reduce(
      (sum, sale) => sum + Number(sale.discount || 0),
      0
    ),

    tax: sales.reduce(
      (sum, sale) => sum + Number(sale.tax || 0),
      0
    ),
  };

  // ==========================================
  // USE BACKEND SUMMARY IF AVAILABLE
  // ==========================================

  const backendSummary = report?.summary || {};

  const hasBackendData =
    Number(backendSummary.totalSales || 0) > 0 ||
    Number(backendSummary.totalTransactions || 0) > 0;

  const summary = hasBackendData
    ? backendSummary
    : calculatedSummary;

  return (
    <>
      {/* SUMMARY */}

      <div className="report-summary-grid">

        <div className="report-summary-card">
          <span>Total Sales</span>

          <strong>
            {formatCurrency(summary.totalSales)}
          </strong>

          <small>
            Revenue in selected period
          </small>
        </div>

        <div className="report-summary-card">
          <span>Transactions</span>

          <strong>
            {summary.totalTransactions}
          </strong>

          <small>
            Completed sales
          </small>
        </div>

        <div className="report-summary-card">
          <span>Average Sale</span>

          <strong>
            {formatCurrency(summary.averageSale)}
          </strong>

          <small>
            Average transaction value
          </small>
        </div>

        <div className="report-summary-card">
          <span>Items Sold</span>

          <strong>
            {summary.totalItemsSold}
          </strong>

          <small>
            Product units sold
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

      {/* PAYMENT + SOURCE */}

      <div className="report-two-column">

        <div className="report-section">

          <div className="report-section-header">
            <h2>Payment Methods</h2>

            <span>
              Revenue by payment type
            </span>
          </div>

          {report.paymentBreakdown?.length > 0 ? (

            <div className="report-breakdown-list">

              {report.paymentBreakdown.map(
                (item) => (

                  <div
                    className="report-breakdown-row"
                    key={item.paymentMethod}
                  >

                    <div>
                      <strong>
                        {formatText(item.paymentMethod)}
                      </strong>

                      <span>
                        {item.transactions} transactions
                      </span>
                    </div>

                    <strong>
                      {formatCurrency(item.amount)}
                    </strong>

                  </div>
                )
              )}

            </div>

          ) : (

            <div className="report-empty">
              No payment data.
            </div>

          )}

        </div>

        <div className="report-section">

          <div className="report-section-header">
            <h2>Sales Channels</h2>

            <span>
              POS and online sales
            </span>
          </div>

          {report.sourceBreakdown?.length > 0 ? (

            <div className="report-breakdown-list">

              {report.sourceBreakdown.map(
                (item) => (

                  <div
                    className="report-breakdown-row"
                    key={item.source}
                  >

                    <div>
                      <strong>
                        {formatText(item.source)}
                      </strong>

                      <span>
                        {item.transactions} transactions
                      </span>
                    </div>

                    <strong>
                      {formatCurrency(item.amount)}
                    </strong>

                  </div>
                )
              )}

            </div>

          ) : (

            <div className="report-empty">
              No channel data.
            </div>

          )}

        </div>

      </div>

      {/* TOP PRODUCTS */}

      <div className="report-section">

        <div className="report-section-header">
          <h2>Top Selling Products</h2>

          <span>Top 10 by quantity</span>
        </div>

        <div className="report-table">

          <div className="report-table-header">
            <div>Product</div>
            <div>SKU</div>
            <div>Quantity</div>
            <div>Revenue</div>
          </div>

          {report.topProducts?.length > 0 ? (

            report.topProducts.map(
              (product) => (

                <div
                  className="report-table-row"
                  key={
                    product.productId ||
                    product.productName
                  }
                >
                  <div>
                    <strong>
                      {product.productName}
                    </strong>
                  </div>

                  <div>
                    {product.sku || "-"}
                  </div>

                  <div>
                    {product.quantitySold}
                  </div>

                  <div className="report-money">
                    {formatCurrency(product.revenue)}
                  </div>
                </div>
              )
            )

          ) : (

            <div className="report-table-empty">
              No products sold.
            </div>

          )}

        </div>

      </div>

      {/* RECENT SALES */}

      <div className="report-section">

        <div className="report-section-header">
          <h2>Recent Sales</h2>

          <span>Latest transactions</span>
        </div>

        <div className="report-sales-table">

          <div className="report-sales-header">
            <div>Sale</div>
            <div>Date</div>
            <div>Customer</div>
            <div>Cashier</div>
            <div>Method</div>
            <div>Source</div>
            <div>Total</div>
          </div>

          {sales.length > 0 ? (

            sales.map((sale) => (

              <div
                className="report-sales-row"
                key={sale._id}
              >

                <div className="report-sale-number">
                  {sale.saleNumber}
                </div>

                <div>
                  {formatDate(sale.createdAt)}
                </div>

                <div>
                  {sale.customerId?.name || "Walk-in"}
                </div>

                <div>
                  {sale.cashierId?.name || "-"}
                </div>

                <div>
                  {formatText(sale.paymentMethod)}
                </div>

                <div>
                  {formatText(sale.source)}
                </div>

                <div className="report-money">
                  {formatCurrency(sale.total)}
                </div>

              </div>
            ))

          ) : (

            <div className="report-table-empty">
              No sales found.
            </div>

          )}

        </div>

      </div>
    </>
  );
};

export default SalesReport;