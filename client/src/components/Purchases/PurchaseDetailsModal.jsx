import {
  useEffect,
  useState,
} from "react";

import "./PurchaseDetailsModal.css";

import {
  getPurchaseById,
} from "../../services/purchaseService";


const PurchaseDetailsModal = ({
  isOpen,
  purchaseId,
  onClose,
}) => {
  // ==========================================
  // STATE
  // ==========================================

  const [purchase, setPurchase] =
    useState(null);

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // LOAD PURCHASE DETAILS
  // ==========================================

  useEffect(() => {
    if (
      !isOpen ||
      !purchaseId
    ) {
      return;
    }

    const fetchPurchase = async () => {
      try {
        setLoading(true);

        setPurchase(null);

        const response =
          await getPurchaseById(
            purchaseId
          );

        setPurchase(
          response.purchase
        );

      } catch (error) {
        console.error(
          "Get Purchase Details Error:",
          error
        );

        alert(
          error.response?.data?.message ||
            "Failed to load purchase details."
        );

        onClose();

      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();

  }, [
    isOpen,
    purchaseId,
  ]);


  // ==========================================
  // FORMAT MONEY
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
  // CLOSED
  // ==========================================

  if (!isOpen) {
    return null;
  }


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="purchase-details-overlay">

      <div className="purchase-details-modal">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="purchase-details-header">

          <div>
            <h2>
              Purchase Details
            </h2>

            <p>
              View supplier purchase
              information and received stock.
            </p>
          </div>

          <button
            type="button"
            className="purchase-details-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* =====================================
            BODY
        ===================================== */}

        <div className="purchase-details-body">

          {loading ? (

            <div className="purchase-details-loading">
              Loading purchase details...
            </div>

          ) : !purchase ? (

            <div className="purchase-details-loading">
              Purchase not found.
            </div>

          ) : (

            <>

              {/* =============================
                  PURCHASE SUMMARY
              ============================= */}

              <div className="purchase-details-top">

                <div>

                  <span className="details-label">
                    Purchase Number
                  </span>

                  <strong className="details-purchase-number">
                    {
                      purchase.purchaseNumber
                    }
                  </strong>

                </div>


                <div className="purchase-details-statuses">

                  <span
                    className={`purchase-details-status ${purchase.status}`}
                  >
                    {
                      purchase.status
                    }
                  </span>

                  <span
                    className={`purchase-details-payment ${purchase.paymentStatus}`}
                  >
                    {
                      purchase.paymentStatus
                    }
                  </span>

                </div>

              </div>


              {/* =============================
                  INFORMATION
              ============================= */}

              <div className="purchase-details-grid">

                {/* SUPPLIER */}

                <div className="purchase-details-card">

                  <h3>
                    Supplier
                  </h3>

                  <div className="details-info-row">

                    <span>
                      Name
                    </span>

                    <strong>
                      {purchase.supplierId
                        ?.name || "-"}
                    </strong>

                  </div>


                  <div className="details-info-row">

                    <span>
                      Contact
                    </span>

                    <strong>
                      {purchase.supplierId
                        ?.contactPerson ||
                        "-"}
                    </strong>

                  </div>


                  <div className="details-info-row">

                    <span>
                      Phone
                    </span>

                    <strong>
                      {purchase.supplierId
                        ?.phone || "-"}
                    </strong>

                  </div>


                  <div className="details-info-row">

                    <span>
                      Email
                    </span>

                    <strong>
                      {purchase.supplierId
                        ?.email || "-"}
                    </strong>

                  </div>

                </div>


                {/* PURCHASE */}

                <div className="purchase-details-card">

                  <h3>
                    Purchase Information
                  </h3>

                  <div className="details-info-row">

                    <span>
                      Supplier Reference
                    </span>

                    <strong>
                      {purchase.supplierReference ||
                        "-"}
                    </strong>

                  </div>


                  <div className="details-info-row">

                    <span>
                      Created
                    </span>

                    <strong>
                      {formatDate(
                        purchase.createdAt
                      )}
                    </strong>

                  </div>


                  <div className="details-info-row">

                    <span>
                      Received
                    </span>

                    <strong>
                      {formatDate(
                        purchase.receivedAt
                      )}
                    </strong>

                  </div>

                </div>

              </div>


              {/* =============================
                  PRODUCTS
              ============================= */}

              <div className="purchase-details-section">

                <div className="purchase-details-section-heading">

                  <h3>
                    Purchased Items
                  </h3>

                  <span>
                    {purchase.items?.length ||
                      0}{" "}
                    products
                  </span>

                </div>


                <div className="purchase-details-table">

                  {/* HEADER */}

                  <div className="purchase-details-table-header">

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
                      Unit Cost
                    </div>

                    <div>
                      Total
                    </div>

                  </div>


                  {/* ITEMS */}

                  {purchase.items?.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        className="purchase-details-table-row"
                        key={
                          item._id ||
                          `${item.productId}-${index}`
                        }
                      >

                        <div>

                          <strong className="details-product-name">
                            {
                              item.productName
                            }
                          </strong>

                        </div>


                        <div>
                          {item.sku ||
                            "-"}
                        </div>


                        <div>
                          {
                            item.quantity
                          }
                        </div>


                        <div>
                          {formatCurrency(
                            item.unitCost
                          )}
                        </div>


                        <div className="details-item-total">
                          {formatCurrency(
                            item.subtotal
                          )}
                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>


              {/* =============================
                  BOTTOM SECTION
              ============================= */}

              <div className="purchase-details-bottom">

                {/* USER / NOTES */}

                <div>

                  <div className="purchase-details-card">

                    <h3>
                      Activity
                    </h3>


                    <div className="details-info-row">

                      <span>
                        Created By
                      </span>

                      <strong>
                        {purchase.createdBy
                          ?.name ||
                          "-"}
                      </strong>

                    </div>


                    <div className="details-info-row">

                      <span>
                        Received By
                      </span>

                      <strong>
                        {purchase.receivedBy
                          ?.name ||
                          "-"}
                      </strong>

                    </div>

                  </div>


                  {purchase.notes && (

                    <div className="purchase-details-notes">

                      <span>
                        Notes
                      </span>

                      <p>
                        {
                          purchase.notes
                        }
                      </p>

                    </div>

                  )}

                </div>


                {/* TOTALS */}

                <div className="purchase-details-totals">

                  <div>

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      {formatCurrency(
                        purchase.subtotal
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Discount
                    </span>

                    <strong>
                      -
                      {formatCurrency(
                        purchase.discount
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Tax
                    </span>

                    <strong>
                      +
                      {formatCurrency(
                        purchase.tax
                      )}
                    </strong>

                  </div>


                  <div className="purchase-details-grand-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      {formatCurrency(
                        purchase.total
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            </>
          )}

        </div>


        {/* =====================================
            FOOTER
        ===================================== */}

        <div className="purchase-details-footer">

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

export default PurchaseDetailsModal;