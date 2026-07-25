import { useEffect, useState } from "react";
import "./CustomerDetailsModal.css";

import { getCustomerSales } from "../../services/saleService";

const CustomerDetailsModal = ({
  isOpen,
  customer,
  onClose,
}) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH CUSTOMER PURCHASE HISTORY
  // ==========================================

  useEffect(() => {
    if (!isOpen || !customer?._id) {
      return;
    }

    const fetchCustomerSales = async () => {
      try {
        setLoading(true);
        setError("");
        setSales([]);

        const response =
          await getCustomerSales(
            customer._id
          );

        setSales(
          response.sales || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch customer sales:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load purchase history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerSales();
  }, [isOpen, customer?._id]);

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(Number(amount || 0));
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // DON'T RENDER
  // ==========================================

  if (!isOpen || !customer) {
    return null;
  }

  const isRepeat =
    Number(customer.totalOrders || 0) >= 3;

  return (
    <div
      className="customer-details-overlay"
      onClick={onClose}
    >
      <div
        className="customer-details-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* =================================
            HEADER
        ================================= */}

        <div className="customer-details-header">

          <div>
            <h2>
              Customer Details
            </h2>

            <span>
              {customer.customerNumber}
            </span>
          </div>

          <button
            type="button"
            className="customer-details-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {/* =================================
            CUSTOMER
        ================================= */}

        <div className="customer-details-profile">

          <div>
            <span>Name</span>

            <strong>
              {customer.name || "-"}
            </strong>
          </div>

          <div>
            <span>Phone</span>

            <strong>
              {customer.phone || "-"}
            </strong>
          </div>

          <div>
            <span>Email</span>

            <strong>
              {customer.email || "-"}
            </strong>
          </div>

          <div>
            <span>Status</span>

            <strong>
              {customer.status
                ? "Active"
                : "Inactive"}
            </strong>
          </div>

          <div>
            <span>Address</span>

            <strong>
              {customer.address || "-"}
            </strong>
          </div>

          <div>
            <span>Location</span>

            <strong>
              {[
                customer.city,
                customer.postcode,
                customer.country,
              ]
                .filter(Boolean)
                .join(", ") || "-"}
            </strong>
          </div>

        </div>

        {/* =================================
            CUSTOMER STATISTICS
        ================================= */}

        <div className="customer-details-stats">

          <div>
            <span>Total Orders</span>

            <strong>
              {customer.totalOrders || 0}
            </strong>
          </div>

          <div>
            <span>Total Spent</span>

            <strong>
              {formatCurrency(
                customer.totalSpent
              )}
            </strong>
          </div>

          <div>
            <span>Customer Type</span>

            <strong>
              {isRepeat
                ? "Repeat Customer"
                : "Regular Customer"}
            </strong>
          </div>

          <div>
            <span>Last Purchase</span>

            <strong>
              {formatDate(
                customer.lastPurchaseAt
              )}
            </strong>
          </div>

        </div>

        {/* =================================
            PURCHASE HISTORY
        ================================= */}

        <div className="customer-purchase-history">

          <div className="customer-history-title">

            <h3>
              Purchase History
            </h3>

            <span>
              {sales.length} sales
            </span>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="customer-history-message">
              Loading purchase history...
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="customer-history-error">
              {error}
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            sales.length === 0 && (
              <div className="customer-history-message">
                This customer has no
                purchase history.
              </div>
            )}

          {/* SALES */}

          {!loading &&
            !error &&
            sales.map((sale) => (
              <div
                className="customer-sale"
                key={sale._id}
              >

                {/* SALE HEADER */}

                <div className="customer-sale-header">

                  <div>
                    <strong>
                      {sale.saleNumber}
                    </strong>

                    <span>
                      {formatDate(
                        sale.createdAt
                      )}
                    </span>
                  </div>

                  <div className="customer-sale-header-right">

                    <span className="customer-sale-payment">
                      {sale.paymentMethod ||
                        "-"}
                    </span>

                    <strong>
                      {formatCurrency(
                        sale.total
                      )}
                    </strong>

                  </div>

                </div>

                {/* ITEMS PURCHASED */}

                <div className="customer-sale-items">

                  {sale.items?.length >
                  0 ? (
                    sale.items.map(
                      (item, index) => {
                        const productName =
                          item.productName ||
                          item.productId
                            ?.name ||
                          "Product";

                        const quantity =
                          Number(
                            item.quantity ||
                              0
                          );

                        const price =
                          Number(
                            item.unitPrice ??
                              item.price ??
                              item.sellingPrice ??
                              0
                          );

                        const lineTotal =
                          item.subtotal !==
                          undefined
                            ? Number(
                                item.subtotal
                              )
                            : price *
                              quantity;

                        return (
                          <div
                            className="customer-sale-item"
                            key={
                              item._id ||
                              item.productId
                                ?._id ||
                              index
                            }
                          >

                            <div>
                              <strong>
                                {
                                  productName
                                }
                              </strong>

                              {item.productId
                                ?.sku && (
                                <small>
                                  SKU:{" "}
                                  {
                                    item
                                      .productId
                                      .sku
                                  }
                                </small>
                              )}
                            </div>

                            <span>
                              {quantity} ×{" "}
                              {formatCurrency(
                                price
                              )}
                            </span>

                            <strong>
                              {formatCurrency(
                                lineTotal
                              )}
                            </strong>

                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="customer-history-message">
                      No item details
                      available.
                    </div>
                  )}

                </div>

              </div>
            ))}

        </div>

        {/* =================================
            FOOTER
        ================================= */}

        <div className="customer-details-footer">

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

export default CustomerDetailsModal;