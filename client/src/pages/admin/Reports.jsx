import {
  useEffect,
  useState,
} from "react";

import "./Reports.css";

import {
  getSalesReport,
  getProfitReport,
  getPurchaseReport,
  getInventoryReport,
} from "../../services/reportService";

const Reports = () => {

  // ==========================================
  // REPORT TYPE
  // ==========================================

  const [
    reportType,
    setReportType,
  ] = useState("sales");


  // ==========================================
  // DATE FILTER
  // ==========================================

  const [period, setPeriod] =
    useState("month");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");


  // ==========================================
  // REPORT DATA
  // ==========================================

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (
    amount
  ) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(
      Number(amount || 0)
    );
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // FORMAT TEXT
  // ==========================================

  const formatText = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    return value
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };


  // ==========================================
  // FORMAT PERCENT
  // ==========================================

  const formatPercent = (
    value
  ) => {
    return `${Number(
      value || 0
    ).toFixed(2)}%`;
  };


  // ==========================================
  // FETCH REPORT
  // ==========================================

  const fetchReport = async ({
    type = reportType,
    selectedPeriod = period,
  } = {}) => {

    try {

      // ======================================
      // VALIDATE CUSTOM RANGE
      // ======================================

      if (
        selectedPeriod ===
        "custom"
      ) {
        if (
          !startDate ||
          !endDate
        ) {
          alert(
            "Please select start and end dates."
          );

          return;
        }

        if (
          new Date(startDate) >
          new Date(endDate)
        ) {
          alert(
            "Start date cannot be after end date."
          );

          return;
        }
      }


      setLoading(true);


      const params = {
        period:
          selectedPeriod,

        startDate,

        endDate,
      };


      let response;


     if (type === "sales") {
  response = await getSalesReport(
    params
  );
}

else if (type === "profit") {
  response = await getProfitReport(
    params
  );
}

else if (type === "purchases") {
  response = await getPurchaseReport(
    params
  );
}

else if (type === "inventory") {

  response =
    await getInventoryReport();

}


      setReport(response);

    } catch (error) {

      console.error(
        "Report Error:",
        error
      );

      setReport(null);

      alert(
        error.response?.data
          ?.message ||
          "Failed to load report."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    fetchReport({
      type: "sales",
      selectedPeriod: "month",
    });

  }, []);


  // ==========================================
  // CHANGE REPORT
  // ==========================================

  const handleReportChange = (
    type
  ) => {

    setReportType(type);

    setReport(null);


    // Custom requires dates
    if (
      period === "custom" &&
      (
        !startDate ||
        !endDate
      )
    ) {
      return;
    }


    fetchReport({
      type,
      selectedPeriod:
        period,
    });
  };


  // ==========================================
  // CHANGE PERIOD
  // ==========================================

  const handlePeriodChange = (
    newPeriod
  ) => {

    setPeriod(
      newPeriod
    );


    // Don't fetch custom until
    // user selects dates.
    if (
      newPeriod === "custom"
    ) {
      return;
    }


    fetchReport({
      type:
        reportType,

      selectedPeriod:
        newPeriod,
    });
  };


  // ==========================================
  // CUSTOM APPLY
  // ==========================================

  const handleCustomApply =
    () => {

      fetchReport({
        type:
          reportType,

        selectedPeriod:
          "custom",
      });

    };


  // ==========================================
  // SUMMARY
  // ==========================================

  const summary =
    report?.summary || {};


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="reports-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="reports-header">

        <div>

          <h1>
            Reports
          </h1>

          <p>
            Analyze sales, profitability
            and business performance.
          </p>

        </div>

      </div>


      {/* =====================================
          REPORT TYPE
      ===================================== */}

      <div className="report-type-tabs">


        <button
          type="button"
          className={
            reportType === "sales"
              ? "active"
              : ""
          }
          onClick={() =>
            handleReportChange(
              "sales"
            )
          }
        >
          Sales Report
        </button>


        <button
          type="button"
          className={
            reportType === "profit"
              ? "active"
              : ""
          }
          onClick={() =>
            handleReportChange(
              "profit"
            )
          }
        >
          Profit Report
        </button>


        <button
  type="button"
  className={
    reportType === "purchases"
      ? "active"
      : ""
  }
  onClick={() =>
    handleReportChange(
      "purchases"
    )
  }
>
  Purchase Report
</button>


      <button
  type="button"
  className={
    reportType === "inventory"
      ? "active"
      : ""
  }
  onClick={() =>
    handleReportChange(
      "inventory"
    )
  }
>
  Inventory Report
</button>


        <button
          type="button"
          disabled
        >
          Low Stock
        </button>


        <button
          type="button"
          disabled
        >
          Customers
        </button>

      </div>


      {/* =====================================
          FILTER
      ===================================== */}

      <div className="report-filter-card">


        <div className="report-period-buttons">


          <button
            type="button"
            className={
              period === "today"
                ? "active"
                : ""
            }
            onClick={() =>
              handlePeriodChange(
                "today"
              )
            }
          >
            Today
          </button>


          <button
            type="button"
            className={
              period === "week"
                ? "active"
                : ""
            }
            onClick={() =>
              handlePeriodChange(
                "week"
              )
            }
          >
            This Week
          </button>


          <button
            type="button"
            className={
              period === "month"
                ? "active"
                : ""
            }
            onClick={() =>
              handlePeriodChange(
                "month"
              )
            }
          >
            This Month
          </button>


          <button
            type="button"
            className={
              period === "year"
                ? "active"
                : ""
            }
            onClick={() =>
              handlePeriodChange(
                "year"
              )
            }
          >
            This Year
          </button>


          <button
            type="button"
            className={
              period === "custom"
                ? "active"
                : ""
            }
            onClick={() =>
              handlePeriodChange(
                "custom"
              )
            }
          >
            Custom
          </button>


        </div>


        {/* =================================
            CUSTOM DATE
        ================================= */}

        {period === "custom" && (

          <div className="report-custom-filter">


            <div>

              <label>
                From
              </label>

              <input
                type="date"
                value={
                  startDate
                }
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
              />

            </div>


            <div>

              <label>
                To
              </label>

              <input
                type="date"
                value={
                  endDate
                }
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
              />

            </div>


            <button
              type="button"
              className="report-apply-button"
              onClick={
                handleCustomApply
              }
              disabled={
                loading
              }
            >
              Apply
            </button>


          </div>

        )}


        {/* =================================
            ACTIVE RANGE
        ================================= */}

        {report?.dateRange && (

          <div className="report-active-range">

            Showing data from{" "}

            <strong>
              {formatDate(
                report
                  .dateRange
                  .start
              )}
            </strong>

            {" "}to{" "}

            <strong>
              {formatDate(
                report
                  .dateRange
                  .end
              )}
            </strong>

          </div>

        )}


      </div>


      {/* =====================================
          LOADING
      ===================================== */}

      {loading && (

        <div className="reports-loading">
          Loading report...
        </div>

      )}


      {/* =====================================
          SALES REPORT
      ===================================== */}

      {!loading &&
        report &&
        reportType ===
          "sales" && (

        <>

          {/* SUMMARY */}

          <div className="report-summary-grid">


            <div className="report-summary-card">

              <span>
                Total Sales
              </span>

              <strong>
                {formatCurrency(
                  summary.totalSales
                )}
              </strong>

              <small>
                Revenue in selected period
              </small>

            </div>


            <div className="report-summary-card">

              <span>
                Transactions
              </span>

              <strong>
                {summary
                  .totalTransactions ||
                  0}
              </strong>

              <small>
                Completed sales
              </small>

            </div>


            <div className="report-summary-card">

              <span>
                Average Sale
              </span>

              <strong>
                {formatCurrency(
                  summary.averageSale
                )}
              </strong>

              <small>
                Average transaction value
              </small>

            </div>


            <div className="report-summary-card">

              <span>
                Items Sold
              </span>

              <strong>
                {summary
                  .totalItemsSold ||
                  0}
              </strong>

              <small>
                Product units sold
              </small>

            </div>


          </div>


          {/* FINANCIAL */}

          <div className="report-financial-summary">


            <div>

              <span>
                Subtotal
              </span>

              <strong>
                {formatCurrency(
                  summary.subtotal
                )}
              </strong>

            </div>


            <div>

              <span>
                Discounts
              </span>

              <strong>
                {formatCurrency(
                  summary.discount
                )}
              </strong>

            </div>


            <div>

              <span>
                Tax
              </span>

              <strong>
                {formatCurrency(
                  summary.tax
                )}
              </strong>

            </div>


          </div>


          {/* PAYMENT + SOURCE */}

          <div className="report-two-column">


            <div className="report-section">

              <div className="report-section-header">

                <h2>
                  Payment Methods
                </h2>

                <span>
                  Revenue by payment type
                </span>

              </div>


              {report
                .paymentBreakdown
                ?.length > 0 ? (

                <div className="report-breakdown-list">

                  {report.paymentBreakdown.map(
                    (item) => (

                      <div
                        className="report-breakdown-row"
                        key={
                          item.paymentMethod
                        }
                      >

                        <div>

                          <strong>
                            {formatText(
                              item.paymentMethod
                            )}
                          </strong>

                          <span>
                            {
                              item.transactions
                            }{" "}
                            transactions
                          </span>

                        </div>


                        <strong>
                          {formatCurrency(
                            item.amount
                          )}
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

                <h2>
                  Sales Channels
                </h2>

                <span>
                  POS and online sales
                </span>

              </div>


              {report
                .sourceBreakdown
                ?.length > 0 ? (

                <div className="report-breakdown-list">

                  {report.sourceBreakdown.map(
                    (item) => (

                      <div
                        className="report-breakdown-row"
                        key={
                          item.source
                        }
                      >

                        <div>

                          <strong>
                            {formatText(
                              item.source
                            )}
                          </strong>

                          <span>
                            {
                              item.transactions
                            }{" "}
                            transactions
                          </span>

                        </div>


                        <strong>
                          {formatCurrency(
                            item.amount
                          )}
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

              <h2>
                Top Selling Products
              </h2>

              <span>
                Top 10 by quantity
              </span>

            </div>


            <div className="report-table">

              <div className="report-table-header">

                <div>
                  Product
                </div>

                <div>
                  SKU
                </div>

                <div>
                  Quantity
                </div>

                <div>
                  Revenue
                </div>

              </div>


              {report
                .topProducts
                ?.length > 0 ? (

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
                          {
                            product.productName
                          }
                        </strong>
                      </div>

                      <div>
                        {product.sku ||
                          "-"}
                      </div>

                      <div>
                        {
                          product.quantitySold
                        }
                      </div>

                      <div className="report-money">
                        {formatCurrency(
                          product.revenue
                        )}
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

              <h2>
                Recent Sales
              </h2>

              <span>
                Latest transactions
              </span>

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


              {report
                .recentSales
                ?.length > 0 ? (

                report.recentSales.map(
                  (sale) => (

                    <div
                      className="report-sales-row"
                      key={
                        sale._id
                      }
                    >

                      <div className="report-sale-number">
                        {
                          sale.saleNumber
                        }
                      </div>

                      <div>
                        {formatDate(
                          sale.createdAt
                        )}
                      </div>

                      <div>
                        {sale
                          .customerId
                          ?.name ||
                          "Walk-in"}
                      </div>

                      <div>
                        {sale
                          .cashierId
                          ?.name ||
                          "-"}
                      </div>

                      <div>
                        {formatText(
                          sale.paymentMethod
                        )}
                      </div>

                      <div>
                        {formatText(
                          sale.source
                        )}
                      </div>

                      <div className="report-money">
                        {formatCurrency(
                          sale.total
                        )}
                      </div>

                    </div>

                  )
                )

              ) : (

                <div className="report-table-empty">
                  No sales found.
                </div>

              )}

            </div>

          </div>

        </>

      )}


      {/* =====================================
          PROFIT REPORT
      ===================================== */}

      {!loading &&
        report &&
        reportType ===
          "profit" && (

        <>

          {/* =================================
              PROFIT SUMMARY
          ================================= */}

          <div className="report-summary-grid">


            <div className="report-summary-card">

              <span>
                Revenue
              </span>

              <strong>
                {formatCurrency(
                  summary.productRevenue
                )}
              </strong>

              <small>
                Product sales before
                discounts
              </small>

            </div>


            <div className="report-summary-card">

              <span>
                Cost of Goods
              </span>

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

              <span>
                Gross Profit
              </span>

              <strong>
                {formatCurrency(
                  summary.grossProfit
                )}
              </strong>

              <small>
                Revenue minus discount
                and product cost
              </small>

            </div>


            <div className="report-summary-card">

              <span>
                Profit Margin
              </span>

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


          {/* =================================
              PROFIT SECONDARY SUMMARY
          ================================= */}

          <div className="report-financial-summary">


            <div>

              <span>
                Discounts
              </span>

              <strong>
                {formatCurrency(
                  summary.discount
                )}
              </strong>

            </div>


            <div>

              <span>
                Transactions
              </span>

              <strong>
                {summary.transactions ||
                  0}
              </strong>

            </div>


            <div>

              <span>
                Items Sold
              </span>

              <strong>
                {summary.itemsSold ||
                  0}
              </strong>

            </div>


          </div>


          {/* =================================
              PRODUCT PROFIT TABLE
          ================================= */}

          <div className="report-section">

            <div className="report-section-header">

              <h2>
                Product Profitability
              </h2>

              <span>
                Revenue, cost and profit
                by product
              </span>

            </div>


            <div className="profit-table-wrapper">

              <div className="profit-table-header">

                <div>
                  Product
                </div>

                <div>
                  SKU
                </div>

                <div>
                  Qty
                </div>

                <div>
                  Revenue
                </div>

                <div>
                  Cost
                </div>

                <div>
                  Profit
                </div>

                <div>
                  Margin
                </div>

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
                        {product.sku ||
                          "-"}
                      </div>


                      <div>
                        {
                          product.quantitySold
                        }
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

      )}

{/* =====================================
    PURCHASE REPORT
===================================== */}

{!loading &&
  report &&
  reportType === "purchases" && (

  <>

    {/* PURCHASE SUMMARY */}

    <div className="report-summary-grid">

      <div className="report-summary-card">
        <span>Total Purchases</span>

        <strong>
          {formatCurrency(
            summary.totalPurchases
          )}
        </strong>

        <small>
          Total purchase value
        </small>
      </div>


      <div className="report-summary-card">
        <span>Amount Paid</span>

        <strong>
          {formatCurrency(
            summary.amountPaid
          )}
        </strong>

        <small>
          Payments made to suppliers
        </small>
      </div>


      <div className="report-summary-card">
        <span>Outstanding</span>

        <strong>
          {formatCurrency(
            summary.outstanding
          )}
        </strong>

        <small>
          Amount still owed
        </small>
      </div>


      <div className="report-summary-card">
        <span>Purchases</span>

        <strong>
          {summary.purchaseCount || 0}
        </strong>

        <small>
          Purchase transactions
        </small>
      </div>

    </div>


    {/* =================================
        SECONDARY SUMMARY
    ================================= */}

    <div className="report-financial-summary">

      <div>
        <span>Items Purchased</span>

        <strong>
          {summary.totalItemsPurchased || 0}
        </strong>
      </div>


      <div>
        <span>Paid</span>

        <strong>
          {formatCurrency(
            summary.amountPaid
          )}
        </strong>
      </div>


      <div>
        <span>Balance Due</span>

        <strong>
          {formatCurrency(
            summary.outstanding
          )}
        </strong>
      </div>

    </div>


    {/* =================================
        PAYMENT + PRODUCTS
    ================================= */}

    <div className="report-two-column">

      {/* PAYMENT STATUS */}

      <div className="report-section">

        <div className="report-section-header">

          <h2>
            Payment Status
          </h2>

          <span>
            Supplier payment breakdown
          </span>

        </div>


        {report
          .paymentStatusBreakdown
          ?.length > 0 ? (

          <div className="report-breakdown-list">

            {report.paymentStatusBreakdown.map(
              (item) => (

                <div
                  className="report-breakdown-row"
                  key={item.status}
                >

                  <div>

                    <strong>
                      {formatText(
                        item.status
                      )}
                    </strong>

                    <span>
                      {item.purchases || 0}{" "}
                      purchases
                    </span>

                  </div>


                  <div className="purchase-report-amounts">

                    <strong>
                      {formatCurrency(
                        item.amount
                      )}
                    </strong>

                    <span>
                      Due:{" "}
                      {formatCurrency(
                        item.outstanding
                      )}
                    </span>

                  </div>

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


      {/* TOP PURCHASED PRODUCTS */}

      <div className="report-section">

        <div className="report-section-header">

          <h2>
            Top Purchased Products
          </h2>

          <span>
            Products bought from suppliers
          </span>

        </div>


        {report
          .topProducts
          ?.length > 0 ? (

          <div className="report-breakdown-list">

            {report.topProducts.map(
              (product) => (

                <div
                  className="report-breakdown-row"
                  key={
                    product.productId ||
                    product.productName
                  }
                >

                  <div>

                    <strong>
                      {product.productName ||
                        "Product"}
                    </strong>

                    <span>
                      Qty:{" "}
                      {product.quantityPurchased ||
                        0}
                    </span>

                  </div>


                  <strong>
                    {formatCurrency(
                      product.purchaseValue
                    )}
                  </strong>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="report-empty">
            No product purchase data.
          </div>

        )}

      </div>

    </div>


    {/* =================================
        SUPPLIER SUMMARY
    ================================= */}

    <div className="report-section">

      <div className="report-section-header">

        <h2>
          Supplier Summary
        </h2>

        <span>
          Purchase spending by supplier
        </span>

      </div>


      <div className="purchase-report-table-wrapper">

        <div className="purchase-report-table-header">

          <div>Supplier</div>

          <div>Purchases</div>

          <div>Total</div>

          <div>Paid</div>

          <div>Outstanding</div>

        </div>


        {report
          .supplierSummary
          ?.length > 0 ? (

          report.supplierSummary.map(
            (supplier) => (

              <div
                className="purchase-report-table-row"
                key={
                  supplier.supplierId ||
                  supplier.supplierName
                }
              >

                <div>

                  <strong>
                    {supplier.supplierName ||
                      "Unknown Supplier"}
                  </strong>

                </div>


                <div>
                  {supplier.purchaseCount || 0}
                </div>


                <div>
                  {formatCurrency(
                    supplier.totalPurchases
                  )}
                </div>


                <div>
                  {formatCurrency(
                    supplier.amountPaid
                  )}
                </div>


                <div className="purchase-outstanding">

                  {formatCurrency(
                    supplier.outstanding
                  )}

                </div>

              </div>

            )
          )

        ) : (

          <div className="report-table-empty">
            No supplier purchase data.
          </div>

        )}

      </div>

    </div>


    {/* =================================
        RECENT PURCHASES
    ================================= */}

    <div className="report-section">

      <div className="report-section-header">

        <h2>
          Recent Purchases
        </h2>

        <span>
          Latest supplier purchases
        </span>

      </div>


      <div className="purchase-history-wrapper">

        <div className="purchase-history-header">

          <div>Purchase</div>

          <div>Date</div>

          <div>Supplier</div>

          <div>Total</div>

          <div>Paid</div>

          <div>Balance</div>

          <div>Status</div>

        </div>


        {report
          .recentPurchases
          ?.length > 0 ? (

          report.recentPurchases.map(
            (purchase) => {

              const purchaseTotal =
                Number(
                  purchase.total || 0
                );

              const purchasePaid =
                Number(
                  purchase.amountPaid || 0
                );

              const purchaseBalance =
                Math.max(
                  purchaseTotal -
                    purchasePaid,
                  0
                );


              return (

                <div
                  className="purchase-history-row"
                  key={purchase._id}
                >

                  <div className="report-sale-number">

                    {
                      purchase.purchaseNumber
                    }

                  </div>


                  <div>

                    {formatDate(
                      purchase.createdAt
                    )}

                  </div>


                  <div>

                    {purchase
                      .supplierId
                      ?.name ||
                      "Unknown Supplier"}

                  </div>


                  <div>

                    {formatCurrency(
                      purchaseTotal
                    )}

                  </div>


                  <div>

                    {formatCurrency(
                      purchasePaid
                    )}

                  </div>


                  <div className="purchase-outstanding">

                    {formatCurrency(
                      purchaseBalance
                    )}

                  </div>


                  <div>

                    <span
                      className={`purchase-status-badge ${
                        purchase.paymentStatus ||
                        ""
                      }`}
                    >

                      {formatText(
                        purchase.paymentStatus
                      )}

                    </span>

                  </div>

                </div>

              );

            }
          )

        ) : (

          <div className="report-table-empty">

            No purchases found for this
            period.

          </div>

        )}

      </div>

    </div>

  </>

)}
{/* =====================================
    INVENTORY REPORT
===================================== */}

{!loading &&
  report &&
  reportType === "inventory" && (

  <>

    {/* SUMMARY */}

    <div className="report-summary-grid">

      <div className="report-summary-card">

        <span>
          Products
        </span>

        <strong>
          {summary.totalProducts || 0}
        </strong>

        <small>
          Total products
        </small>

      </div>


      <div className="report-summary-card">

        <span>
          Stock Units
        </span>

        <strong>
          {summary.totalStockQuantity || 0}
        </strong>

        <small>
          Units currently available
        </small>

      </div>


      <div className="report-summary-card">

        <span>
          Stock Cost
        </span>

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

        <span>
          Retail Value
        </span>

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


    {/* SECOND SUMMARY */}

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

        <span>
          Low Stock
        </span>

        <strong>
          {summary.lowStockProducts || 0}
        </strong>

      </div>


      <div>

        <span>
          Out of Stock
        </span>

        <strong>
          {summary.outOfStockProducts || 0}
        </strong>

      </div>

    </div>


    {/* INVENTORY TABLE */}

    <div className="report-section">

      <div className="report-section-header">

        <h2>
          Current Inventory
        </h2>

        <span>
          Current product stock and value
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
                    {product.sku || "-"}
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

)}
      {/* =====================================
          NO DATA
      ===================================== */}

      {!loading &&
        !report && (

        <div className="reports-loading">
          Select a report or date range.
        </div>

      )}


    </div>
  );
};

export default Reports;