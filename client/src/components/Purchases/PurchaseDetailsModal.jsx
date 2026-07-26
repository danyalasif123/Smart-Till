import {
  useEffect,
  useState,
} from "react";

import "./PurchaseDetailsModal.css";

import {
  getPurchaseById,
  getPurchasePayments,
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

  const [payments, setPayments] =
    useState([]);

  const [
    paymentSummary,
    setPaymentSummary,
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [
    paymentLoading,
    setPaymentLoading,
  ] = useState(false);


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    if (
      !isOpen ||
      !purchaseId
    ) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        setPaymentLoading(true);

        setPurchase(null);

        setPayments([]);

        setPaymentSummary(null);


        // ====================================
        // GET PURCHASE
        // ====================================

        const purchaseResponse =
          await getPurchaseById(
            purchaseId
          );

        setPurchase(
          purchaseResponse.purchase
        );


        // ====================================
        // GET PAYMENT HISTORY
        // ====================================

        try {
          const paymentResponse =
            await getPurchasePayments(
              purchaseId
            );

          setPayments(
            paymentResponse.payments ||
              []
          );

          setPaymentSummary(
            paymentResponse.summary ||
              null
          );

        } catch (paymentError) {
          console.error(
            "Get Purchase Payments Error:",
            paymentError
          );

          // We don't close the entire modal
          // if payment history fails.
          setPayments([]);

          setPaymentSummary(null);

        } finally {
          setPaymentLoading(false);
        }

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

    fetchData();

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
  // FORMAT PAYMENT METHOD
  // ==========================================

  const formatPaymentMethod = (
    method
  ) => {
    if (!method) {
      return "-";
    }

    return method
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };


  // ==========================================
  // DO NOT RENDER
  // ==========================================

  if (!isOpen) {
    return null;
  }


  // ==========================================
  // PAYMENT VALUES
  // ==========================================

  const total =
    Number(
      paymentSummary?.total ??
        purchase?.total ??
        0
    );

  const amountPaid =
    Number(
      paymentSummary?.amountPaid ??
        purchase?.amountPaid ??
        0
    );

  const balance =
    Number(
      paymentSummary?.balance ??
        Math.max(
          total - amountPaid,
          0
        )
    );

  const paymentStatus =
    paymentSummary?.paymentStatus ||
    purchase?.paymentStatus ||
    "unpaid";


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
              View purchase, stock and
              supplier payment information.
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
                  PURCHASE HEADER
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
                    {purchase.status}
                  </span>


                  <span
                    className={`purchase-details-payment ${paymentStatus}`}
                  >
                    {paymentStatus}
                  </span>

                </div>

              </div>


              {/* =============================
                  SUPPLIER + PURCHASE INFO
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


                {/* PURCHASE INFO */}

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
                  PURCHASED ITEMS
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
                          index
                        }
                      >

                        <div>

                          <strong className="details-product-name">
                            {item.productName}
                          </strong>

                        </div>


                        <div>
                          {item.sku || "-"}
                        </div>


                        <div>
                          {item.quantity}
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
                  PAYMENT SUMMARY
              ============================= */}

              <div className="purchase-details-section">

                <div className="purchase-details-section-heading">

                  <h3>
                    Payment Summary
                  </h3>

                </div>


                <div className="purchase-payment-details-summary">

                  {/* TOTAL */}

                  <div>

                    <span>
                      Purchase Total
                    </span>

                    <strong>
                      {formatCurrency(
                        total
                      )}
                    </strong>

                  </div>


                  {/* PAID */}

                  <div>

                    <span>
                      Amount Paid
                    </span>

                    <strong>
                      {formatCurrency(
                        amountPaid
                      )}
                    </strong>

                  </div>


                  {/* BALANCE */}

                  <div>

                    <span>
                      Balance Due
                    </span>

                    <strong
                      className={
                        balance > 0
                          ? "payment-balance-due"
                          : "payment-balance-paid"
                      }
                    >
                      {formatCurrency(
                        balance
                      )}
                    </strong>

                  </div>


                  {/* STATUS */}

                  <div>

                    <span>
                      Payment Status
                    </span>

                    <span
                      className={`purchase-details-payment ${paymentStatus}`}
                    >
                      {paymentStatus}
                    </span>

                  </div>

                </div>

              </div>


              {/* =============================
                  PAYMENT HISTORY
              ============================= */}

              <div className="purchase-details-section">

                <div className="purchase-details-section-heading">

                  <h3>
                    Payment History
                  </h3>

                  <span>
                    {payments.length}{" "}
                    payment
                    {payments.length !== 1
                      ? "s"
                      : ""}
                  </span>

                </div>


                {paymentLoading ? (

                  <div className="purchase-payment-history-message">
                    Loading payment history...
                  </div>

                ) : payments.length === 0 ? (

                  <div className="purchase-payment-history-empty">

                    <strong>
                      No payments recorded
                    </strong>

                    <span>
                      This purchase does not
                      have any payment records
                      yet.
                    </span>

                  </div>

                ) : (

                  <div className="purchase-payment-history-table">

                    {/* HEADER */}

                    <div className="purchase-payment-history-header">

                      <div>
                        Date
                      </div>

                      <div>
                        Method
                      </div>

                      <div>
                        Reference
                      </div>

                      <div>
                        Recorded By
                      </div>

                      <div>
                        Amount
                      </div>

                    </div>


                    {/* PAYMENTS */}

                    {payments.map(
                      (payment) => (

                        <div
                          className="purchase-payment-history-row"
                          key={payment._id}
                        >

                          {/* DATE */}

                          <div>
                            {formatDate(
                              payment.createdAt
                            )}
                          </div>


                          {/* METHOD */}

                          <div>

                            <span className="payment-method-badge">

                              {formatPaymentMethod(
                                payment.paymentMethod
                              )}

                            </span>

                          </div>


                          {/* REFERENCE */}

                          <div>
                            {payment.reference ||
                              "-"}
                          </div>


                          {/* CREATED BY */}

                          <div>
                            {payment.createdBy
                              ?.name ||
                              "-"}
                          </div>


                          {/* AMOUNT */}

                          <div className="payment-history-amount">

                            {formatCurrency(
                              payment.amount
                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>


              {/* =============================
                  PAYMENT NOTES
              ============================= */}

              {payments.some(
                (payment) =>
                  payment.notes
              ) && (

                <div className="purchase-details-section">

                  <div className="purchase-details-section-heading">

                    <h3>
                      Payment Notes
                    </h3>

                  </div>


                  <div className="purchase-payment-notes-list">

                    {payments
                      .filter(
                        (payment) =>
                          payment.notes
                      )
                      .map(
                        (payment) => (

                          <div
                            className="purchase-payment-note"
                            key={
                              payment._id
                            }
                          >

                            <div>

                              <strong>
                                {formatCurrency(
                                  payment.amount
                                )}
                              </strong>

                              <span>
                                {formatDate(
                                  payment.createdAt
                                )}
                              </span>

                            </div>

                            <p>
                              {
                                payment.notes
                              }
                            </p>

                          </div>

                        )
                      )}

                  </div>

                </div>

              )}


              {/* =============================
                  BOTTOM
              ============================= */}

              <div className="purchase-details-bottom">

                {/* ACTIVITY */}

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


                  {/* PURCHASE NOTES */}

                  {purchase.notes && (

                    <div className="purchase-details-notes">

                      <span>
                        Purchase Notes
                      </span>

                      <p>
                        {purchase.notes}
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


                  <div className="purchase-details-paid-total">

                    <span>
                      Paid
                    </span>

                    <strong>
                      {formatCurrency(
                        amountPaid
                      )}
                    </strong>

                  </div>


                  <div className="purchase-details-balance-total">

                    <span>
                      Balance
                    </span>

                    <strong>
                      {formatCurrency(
                        balance
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