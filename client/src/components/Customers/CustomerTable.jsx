import "./CustomerTable.css";
import Badge from "../common/Badge/Badge";

const CustomerTable = ({
  customers = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) => {
  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount || 0);
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="customer-table-message">
        Loading customers...
      </div>
    );
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (customers.length === 0) {
    return (
      <div className="customer-table-message">
        No customers found.
      </div>
    );
  }

  return (
    <div className="customer-table-wrapper">

      <div className="customer-table">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="customer-table-header">

          <div>Customer ID</div>

          <div>Customer</div>

          <div>Orders</div>

          <div>Total Spent</div>

          <div>Last Purchase</div>

          <div>Type</div>

          <div>Status</div>

          <div>Actions</div>

        </div>

        {/* =====================================
            ROWS
        ===================================== */}

        {customers.map((customer) => {

          const isRepeat =
            customer.totalOrders >= 3;

          return (
            <div
              className="customer-table-row"
              key={customer._id}
            >

              {/* CUSTOMER NUMBER */}

              <div
                className="
                  customer-table-cell
                  customer-number
                "
              >
                {customer.customerNumber || "-"}
              </div>


              {/* CUSTOMER */}

              <div className="customer-table-cell">

                <div className="customer-name">
                  {customer.name}
                </div>

                {customer.email && (
                  <div className="customer-email">
                    {customer.email}
                  </div>
                )}

              </div>


              {/* ORDERS */}

              <div className="customer-table-cell">
                {customer.totalOrders || 0}
              </div>


              {/* TOTAL SPENT */}

              <div className="customer-table-cell customer-money">
                {formatCurrency(
                  customer.totalSpent
                )}
              </div>


              {/* LAST PURCHASE */}

              <div className="customer-table-cell">
                {formatDate(
                  customer.lastPurchaseAt
                )}
              </div>


              {/* CUSTOMER TYPE */}

              <div className="customer-table-cell">

                <span
                  className={
                    isRepeat
                      ? "customer-type repeat"
                      : "customer-type regular"
                  }
                >
                  {isRepeat
                    ? "Repeat"
                    : "Regular"}
                </span>

              </div>


              {/* STATUS */}

              <div className="customer-table-cell">

                <Badge
                  status={customer.status}
                />

              </div>


              {/* ACTIONS */}

              <div className="customer-table-cell customer-actions">

                <button
                  type="button"
                  className="customer-view-btn"
                  onClick={() =>
                    onView?.(customer)
                  }
                >
                  View
                </button>

                <button
                  type="button"
                  className="customer-edit-btn"
                  onClick={() =>
                    onEdit?.(customer)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="customer-delete-btn"
                  onClick={() =>
                    onDelete?.(customer)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default CustomerTable;