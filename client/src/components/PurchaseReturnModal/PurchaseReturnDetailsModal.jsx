import "./PurchaseReturnDetailsModal.css";

const PurchaseReturnDetailsModal = ({
  purchaseReturn,
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
              Purchase Return Details
            </h2>

            <p>
              {purchaseReturn.returnNumber}
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
              Purchase Number
            </span>

            <strong>

              {purchaseReturn.purchaseId?.purchaseNumber}

            </strong>

          </div>

          <div>

            <span>
              Supplier
            </span>

            <strong>

              {purchaseReturn.supplierId?.name}

            </strong>

          </div>

          <div>

            <span>
              Returned By
            </span>

            <strong>

              {purchaseReturn.returnedBy?.name}

            </strong>

          </div>

          <div>

            <span>
              Date
            </span>

            <strong>

              {formatDate(
                purchaseReturn.createdAt
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

            {purchaseReturn.reason?.replaceAll(
              "_",
              " "
            )}

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

            {purchaseReturn.notes ||
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
                  Unit Cost
                </th>

                <th>
                  Refund
                </th>

              </tr>

            </thead>

            <tbody>

              {purchaseReturn.items.map(
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
                        item.unitCost
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
                purchaseReturn.totalRefund
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

export default PurchaseReturnDetailsModal;