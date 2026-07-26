import {
  useEffect,
  useState,
} from "react";

import "./PurchasePaymentModal.css";

import {
  recordPurchasePayment,
} from "../../services/purchaseService";


const PurchasePaymentModal = ({
  isOpen,
  purchase,
  onClose,
  onSuccess,
}) => {
  // ==========================================
  // STATE
  // ==========================================

  const [amount, setAmount] =
    useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("bank_transfer");

  const [
    reference,
    setReference,
  ] = useState("");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // RESET FORM WHEN MODAL OPENS
  // ==========================================

  useEffect(() => {
    if (isOpen) {
      setAmount("");

      setPaymentMethod(
        "bank_transfer"
      );

      setReference("");

      setNotes("");
    }
  }, [
    isOpen,
    purchase?._id,
  ]);


  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatCurrency = (
    value
  ) => {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(
      Number(value || 0)
    );
  };


  // ==========================================
  // DO NOT RENDER
  // ==========================================

  if (
    !isOpen ||
    !purchase
  ) {
    return null;
  }


  // ==========================================
  // PURCHASE VALUES
  // ==========================================

  const total =
    Number(
      purchase.total || 0
    );

  const amountPaid =
    Number(
      purchase.amountPaid || 0
    );

  const balance =
    Math.max(
      total - amountPaid,
      0
    );


  // ==========================================
  // HANDLE SUBMIT
  // ==========================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();


    // ========================================
    // CONVERT AMOUNT
    // ========================================

    const payment =
      Number(amount);


    // ========================================
    // VALIDATE PAYMENT
    // ========================================

    if (
      Number.isNaN(payment) ||
      payment <= 0
    ) {
      alert(
        "Enter a valid payment amount."
      );

      return;
    }


    // ========================================
    // PREVENT OVERPAYMENT
    // ========================================

    if (payment > balance) {
      alert(
        `Maximum payment is ${formatCurrency(
          balance
        )}.`
      );

      return;
    }


    // ========================================
    // VALIDATE PAYMENT METHOD
    // ========================================

    if (!paymentMethod) {
      alert(
        "Please select a payment method."
      );

      return;
    }


    try {
      setLoading(true);


      // ======================================
      // PAYMENT DATA
      //
      // Backend now receives:
      //
      // amount
      // paymentMethod
      // reference
      // notes
      // ======================================

      const paymentData = {
        amount: payment,

        paymentMethod,

        reference:
          reference.trim(),

        notes:
          notes.trim(),
      };


      // ======================================
      // RECORD PAYMENT
      // ======================================

      const response =
        await recordPurchasePayment(
          purchase._id,
          paymentData
        );


      // ======================================
      // SUCCESS
      // ======================================

      alert(
        response.message ||
          "Payment recorded successfully."
      );


      // ======================================
      // REFRESH PURCHASE LIST
      // ======================================

      await onSuccess?.();


      // ======================================
      // CLOSE MODAL
      // ======================================

      onClose();

    } catch (error) {
      console.error(
        "Purchase Payment Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to record payment."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="purchase-payment-overlay">

      <div className="purchase-payment-modal">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="purchase-payment-header">

          <div>

            <h2>
              Record Payment
            </h2>

            <p>
              {purchase.purchaseNumber}
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>

        </div>


        {/* =====================================
            FORM
        ===================================== */}

        <form
          onSubmit={handleSubmit}
        >

          <div className="purchase-payment-body">

            {/* =================================
                PURCHASE SUMMARY
            ================================= */}

            <div className="purchase-payment-summary">

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


              {/* ALREADY PAID */}

              <div>

                <span>
                  Already Paid
                </span>

                <strong>
                  {formatCurrency(
                    amountPaid
                  )}
                </strong>

              </div>


              {/* BALANCE */}

              <div className="payment-balance">

                <span>
                  Balance Due
                </span>

                <strong>
                  {formatCurrency(
                    balance
                  )}
                </strong>

              </div>

            </div>


            {/* =================================
                PAYMENT AMOUNT
            ================================= */}

            <div className="purchase-payment-field">

              <label>
                Payment Amount *
              </label>

              <input
                type="number"
                min="0.01"
                max={balance}
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                autoFocus
                required
                disabled={
                  loading ||
                  balance <= 0
                }
              />

            </div>


            {/* =================================
                PAY FULL BALANCE
            ================================= */}

            {balance > 0 && (

              <button
                type="button"
                className="pay-full-balance"
                onClick={() =>
                  setAmount(
                    balance.toFixed(2)
                  )
                }
                disabled={loading}
              >
                Pay Full Balance
              </button>

            )}


            {/* =================================
                PAYMENT METHOD
            ================================= */}

            <div className="purchase-payment-field">

              <label>
                Payment Method *
              </label>

              <select
                value={
                  paymentMethod
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                disabled={loading}
                required
              >

                <option value="cash">
                  Cash
                </option>

                <option value="card">
                  Card
                </option>

                <option value="bank_transfer">
                  Bank Transfer
                </option>

                <option value="cheque">
                  Cheque
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </div>


            {/* =================================
                PAYMENT REFERENCE
            ================================= */}

            <div className="purchase-payment-field">

              <label>
                Payment Reference
              </label>

              <input
                type="text"
                placeholder="e.g. BANK-TRX-1029"
                value={reference}
                onChange={(e) =>
                  setReference(
                    e.target.value
                  )
                }
                disabled={loading}
              />

              <small>
                Optional bank transaction,
                cheque or payment reference.
              </small>

            </div>


            {/* =================================
                NOTES
            ================================= */}

            <div className="purchase-payment-field">

              <label>
                Notes
              </label>

              <textarea
                placeholder="Optional payment notes..."
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                disabled={loading}
              />

            </div>


            {/* =================================
                FULLY PAID MESSAGE
            ================================= */}

            {balance <= 0 && (

              <div className="purchase-payment-paid-message">

                This purchase has already
                been fully paid.

              </div>

            )}

          </div>


          {/* ===================================
              FOOTER
          =================================== */}

          <div className="purchase-payment-footer">

            <button
              type="button"
              className="payment-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="payment-save"
              disabled={
                loading ||
                balance <= 0
              }
            >

              {loading
                ? "Recording..."
                : "Record Payment"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default PurchasePaymentModal;