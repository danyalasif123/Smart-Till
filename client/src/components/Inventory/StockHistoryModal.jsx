import {
  useEffect,
  useState,
} from "react";

import "./StockHistoryModal.css";

import {
  getProductStockHistory,
} from "../../services/inventoryService";

const StockHistoryModal = ({
  isOpen,
  product,
  onClose,
}) => {
  // ==========================================
  // STATE
  // ==========================================

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // FETCH HISTORY
  // ==========================================

  useEffect(() => {
    if (!isOpen || !product?._id) {
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getProductStockHistory(
            product._id
          );

        setTransactions(
          response.transactions || []
        );
      } catch (error) {
        console.error(
          "Stock History Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load stock history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

  }, [isOpen, product]);


  // ==========================================
  // CLOSED
  // ==========================================

  if (!isOpen || !product) {
    return null;
  }


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // ==========================================
  // FORMAT TYPE
  // ==========================================

  const formatType = (type) => {
    const labels = {
      sale: "Sale",
      purchase: "Stock Received",
      adjustment: "Adjustment",
      damage: "Damaged",
      return: "Return",
      opening: "Opening Stock",
    };

    return (
      labels[type] ||
      type ||
      "-"
    );
  };


  // ==========================================
  // QUANTITY
  // ==========================================

  const formatQuantity = (quantity) => {
    const value =
      Number(quantity || 0);

    if (value > 0) {
      return `+${value}`;
    }

    return String(value);
  };


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="history-modal-overlay">

      <div className="history-modal">

        {/* HEADER */}

        <div className="history-modal-header">

          <div>
            <h2>
              Stock History
            </h2>

            <p>
              View all inventory movements
              for this product.
            </p>
          </div>

          <button
            type="button"
            className="history-close-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* PRODUCT SUMMARY */}

        <div className="history-product-summary">

          <div>
            <span>Product</span>

            <strong>
              {product.name}
            </strong>
          </div>

          <div>
            <span>SKU</span>

            <strong>
              {product.sku || "-"}
            </strong>
          </div>

          <div>
            <span>Current Stock</span>

            <strong>
              {product.stockQuantity || 0}{" "}
              {product.unit || "piece"}
            </strong>
          </div>

        </div>


        {/* CONTENT */}

        <div className="history-content">

          {loading ? (

            <div className="history-message">
              Loading stock history...
            </div>

          ) : error ? (

            <div className="history-message error">
              {error}
            </div>

          ) : transactions.length === 0 ? (

            <div className="history-message">
              No stock history found for
              this product.
            </div>

          ) : (

            <div className="history-table-wrapper">

              <div className="history-table">

                {/* HEADER */}

                <div className="history-table-header">

                  <div>Date</div>

                  <div>Type</div>

                  <div>Change</div>

                  <div>Before</div>

                  <div>After</div>

                  <div>Reference</div>

                  <div>User</div>

                </div>


                {/* ROWS */}

                {transactions.map(
                  (transaction) => {

                    const quantity =
                      Number(
                        transaction.quantity ||
                          0
                      );

                    return (
                      <div
                        className="history-table-row"
                        key={transaction._id}
                      >

                        {/* DATE */}

                        <div>
                          {formatDate(
                            transaction.createdAt
                          )}
                        </div>


                        {/* TYPE */}

                        <div>
                          <span
                            className={`history-type history-type-${transaction.type}`}
                          >
                            {formatType(
                              transaction.type
                            )}
                          </span>
                        </div>


                        {/* CHANGE */}

                        <div
                          className={
                            quantity > 0
                              ? "history-quantity positive"
                              : quantity < 0
                              ? "history-quantity negative"
                              : "history-quantity"
                          }
                        >
                          {formatQuantity(
                            quantity
                          )}
                        </div>


                        {/* BEFORE */}

                        <div>
                          {
                            transaction.stockBefore
                          }
                        </div>


                        {/* AFTER */}

                        <div>
                          {
                            transaction.stockAfter
                          }
                        </div>


                        {/* REFERENCE */}

                        <div className="history-reference">
                          {transaction.reference ||
                            "-"}
                        </div>


                        {/* USER */}

                        <div>
                          {transaction.createdBy
                            ?.name || "-"}
                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>
          )}

        </div>


        {/* FOOTER */}

        <div className="history-modal-footer">

          <button
            type="button"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
};

export default StockHistoryModal;