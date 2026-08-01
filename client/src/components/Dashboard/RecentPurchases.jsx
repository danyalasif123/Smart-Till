import { Link } from "react-router-dom";

import "./RecentPurchases.css";

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

const RecentPurchases = ({
  purchases = [],
}) => {

  return (

    <div className="recent-purchases-card">

      <div className="recent-purchases-header">

        <div>

          <h2>
            Recent Purchases
          </h2>

          <p>
            Latest supplier purchases
          </p>

        </div>

        <Link
          to="/admin/purchases"
          className="view-all-purchases"
        >
          View All →
        </Link>

      </div>

      {purchases.length === 0 ? (

        <div className="recent-purchases-empty">

          No recent purchases found.

        </div>

      ) : (

        purchases.map((purchase) => (

          <div
            className="recent-purchase-item"
            key={purchase._id}
          >

            <div className="purchase-top">

              <span className="purchase-number">

                {purchase.purchaseNumber}

              </span>

              <span className="purchase-amount">

                {formatCurrency(
                  purchase.total
                )}

              </span>

              <span className="purchase-date">

                {formatDate(
                  purchase.createdAt
                )}

              </span>

            </div>

            <div className="purchase-bottom">

              <span className="purchase-supplier">

                {purchase.supplierId?.name ||
                  "Unknown Supplier"}

              </span>

              <span
                className={`purchase-status ${purchase.paymentStatus}`}
              >

                {purchase.paymentStatus}

              </span>

            </div>

          </div>

        ))

      )}

    </div>

  );

};

export default RecentPurchases;