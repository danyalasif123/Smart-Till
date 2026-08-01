import "./SaleReturnDetailsModal.css";

const SaleReturnDetailsModal = ({
  saleReturn,
  onClose,
}) => {

  const formatMoney = (amount) => {

    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(Number(amount || 0));

  };

  const formatDate = (date) => {

    return new Intl.DateTimeFormat(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(new Date(date));

  };

  return (

    <div className="return-details-overlay">

      <div className="return-details-modal">

        {/* ===========================
            HEADER
        ============================ */}

        <div className="return-details-header">

          <div>

            <h2>
              Sale Return Details
            </h2>

            <p>
              {saleReturn.returnNumber}
            </p>

          </div>

          <button
            className="return-details-close"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* ===========================
            INFO
        ============================ */}

        <div className="return-details-info">

          <div>

            <span>
              Sale Number
            </span>

            <strong>
              {saleReturn.saleId?.saleNumber}
            </strong>

          </div>

          <div>

            <span>
              Customer
            </span>

            <strong>

              {saleReturn.customerId
                ? saleReturn.customerId.name
                : "Walk-in"}

            </strong>

          </div>

          <div>

            <span>
              Cashier
            </span>

            <strong>
              {saleReturn.returnedBy?.name}
            </strong>

          </div>

          <div>

            <span>
              Date
            </span>

            <strong>

              {formatDate(
                saleReturn.createdAt
              )}

            </strong>

          </div>

        </div>

        {/* ===========================
            REASON
        ============================ */}

        <div className="return-details-section">

          <h3>
            Reason
          </h3>

          <p>
            {saleReturn.reason
              ?.replaceAll("_", " ")}
          </p>

        </div>

        {/* ===========================
            NOTES
        ============================ */}

        <div className="return-details-section">

          <h3>
            Notes
          </h3>

          <p>

            {saleReturn.notes ||
              "No notes."}

          </p>

        </div>

        {/* ===========================
            PRODUCTS
        ============================ */}

        <div className="return-details-section">

          <h3>
            Returned Products
          </h3>

          <table className="return-details-table">

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  Qty
                </th>

                <th>
                  Unit Price
                </th>

                <th>
                  Refund
                </th>

              </tr>

            </thead>

            <tbody>

              {saleReturn.items.map(
                (item) => (

                  <tr
                    key={item.productId}
                  >

                    <td>

                      <strong>
                        {item.productName}
                      </strong>

                      <br />

                      <small>
                        {item.sku}
                      </small>

                    </td>

                    <td>

                      {item.quantityReturned}

                    </td>

                    <td>

                      {formatMoney(
                        item.unitPrice
                      )}

                    </td>

                    <td>

                      <strong>

                        {formatMoney(
                          item.refundAmount
                        )}

                      </strong>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/* ===========================
            FOOTER
        ============================ */}

        <div className="return-details-footer">

          <div>

            <span>
              Total Refund
            </span>

            <strong>

              {formatMoney(
                saleReturn.totalRefund
              )}

            </strong>

          </div>

          <button
            className="return-details-btn"
            onClick={onClose}
          >

            Close

          </button>

        </div>

      </div>

    </div>

  );

};

export default SaleReturnDetailsModal;