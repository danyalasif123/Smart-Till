import { Link } from "react-router-dom";

import "./RecentSales.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(Number(amount || 0));

const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const RecentSales = ({
  sales = [],
}) => {

  return (

    <div className="recent-sales-card">

      <div className="recent-sales-header">

        <div>

          <h2>Recent Sales</h2>

          <p>Latest completed sales</p>

        </div>

        <Link
          to="/admin/sales"
          className="view-all-sales"
        >
          View All →
        </Link>

      </div>

      {sales.length === 0 ? (

        <div className="recent-sales-empty">
          No recent sales found.
        </div>

      ) : (

        sales.map((sale) => (

          <div
            className="recent-sale-item"
            key={sale._id}
          >

            <div className="sale-top">

              <span className="sale-number">
                {sale.saleNumber}
              </span>

              <span className="sale-amount">
                {formatCurrency(
                  sale.total
                )}
              </span>

              <span className="sale-date">
                {formatDate(
                  sale.createdAt
                )}
              </span>

            </div>

            <div className="sale-bottom">

              <span className="sale-customer">
                {sale.customerId?.name ||
                  "Walk-in Customer"}
              </span>

              <span className="payment-method">
                {sale.paymentMethod}
              </span>

            </div>

          </div>

        ))

      )}

    </div>

  );

};

export default RecentSales;