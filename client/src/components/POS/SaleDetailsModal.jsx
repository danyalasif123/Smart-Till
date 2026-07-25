import "./SaleDetailsModal.css";

const SaleDetailsModal = ({
  sale,
  onClose,
}) => {
  if (!sale) {
    return null;
  }

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount || 0));
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div
      className="sale-modal-overlay"
      onClick={onClose}
    >
      <div
        className="sale-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* =================================
            HEADER
        ================================= */}

        <div className="sale-modal-header">
          <div>
            <h2>Sale Details</h2>

            <span>
              {sale.saleNumber}
            </span>
          </div>

          <button
            type="button"
            className="sale-modal-close-icon"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* =================================
            SALE INFORMATION
        ================================= */}

        <div className="sale-detail-info">

          <div className="sale-detail-field">
            <span>Date</span>

            <strong>
              {formatDate(
                sale.createdAt
              )}
            </strong>
          </div>

          <div className="sale-detail-field">
            <span>Customer</span>

            <strong>
              {sale.customerId?.name ||
                "Walk-in"}
            </strong>

            {sale.customerId
              ?.customerNumber && (
              <small>
                {
                  sale.customerId
                    .customerNumber
                }
              </small>
            )}
          </div>

          <div className="sale-detail-field">
            <span>Cashier</span>

            <strong>
              {sale.createdBy?.name ||
                "-"}
            </strong>
          </div>

          <div className="sale-detail-field">
            <span>Payment</span>

            <strong className="sale-payment-method">
              {sale.paymentMethod ||
                "-"}
            </strong>
          </div>

        </div>

        {/* =================================
            ITEMS
        ================================= */}

        <div className="sale-items-section">

          <h3>Items Purchased</h3>

          <div className="sale-items-table-wrapper">

            <table className="sale-items-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>

                {!sale.items ||
                sale.items.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="sale-no-items"
                    >
                      No items found.
                    </td>
                  </tr>
                ) : (
                  sale.items.map(
                    (item, index) => {
                      // Support the fields we used
                      // when creating Sale.
                      const productName =
                        item.productName ||
                        item.productId
                          ?.name ||
                        "Product";

                      const price =
                        Number(
                          item.unitPrice ??
                            item.sellingPrice ??
                            item.price ??
                            0
                        );

                      const quantity =
                        Number(
                          item.quantity || 0
                        );

                      const itemTotal =
                        item.subtotal !==
                        undefined
                          ? Number(
                              item.subtotal
                            )
                          : price *
                            quantity;

                      return (
                        <tr
                          key={
                            item._id ||
                            item.productId
                              ?._id ||
                            index
                          }
                        >
                          <td>
                            <div className="sale-item-product">
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
                          </td>

                          <td>
                            {quantity}
                          </td>

                          <td>
                            {formatMoney(
                              price
                            )}
                          </td>

                          <td>
                            <strong>
                              {formatMoney(
                                itemTotal
                              )}
                            </strong>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* =================================
            TOTALS
        ================================= */}

        <div className="sale-details-totals">

          <div>
            <span>Subtotal</span>

            <span>
              {formatMoney(
                sale.subtotal
              )}
            </span>
          </div>

          <div>
            <span>Discount</span>

            <span>
              -
              {formatMoney(
                sale.discount
              )}
            </span>
          </div>

          <div>
            <span>Tax</span>

            <span>
              {formatMoney(
                sale.tax
              )}
            </span>
          </div>

          <div className="sale-details-grand-total">
            <span>Total</span>

            <strong>
              {formatMoney(
                sale.total
              )}
            </strong>
          </div>

        </div>

        {/* =================================
            FOOTER
        ================================= */}

        <div className="sale-modal-footer">

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

export default SaleDetailsModal;