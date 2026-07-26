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
  const [amount, setAmount] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // RESET
  // ==========================================

  useEffect(() => {
    if (isOpen) {
      setAmount("");
    }
  }, [isOpen]);


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


  if (
    !isOpen ||
    !purchase
  ) {
    return null;
  }


  // ==========================================
  // VALUES
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
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const payment =
      Number(amount);

    if (
      Number.isNaN(payment) ||
      payment <= 0
    ) {
      alert(
        "Enter a valid payment amount."
      );

      return;
    }


    if (payment > balance) {
      alert(
        `Maximum payment is ${formatCurrency(
          balance
        )}.`
      );

      return;
    }


    try {
      setLoading(true);

      const response =
        await recordPurchasePayment(
          purchase._id,
          payment
        );

      alert(
        response.message
      );

      await onSuccess?.();

      onClose();

    } catch (error) {
      console.error(
        "Payment Error:",
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


  return (
    <div className="purchase-payment-overlay">

      <div className="purchase-payment-modal">

        <div className="purchase-payment-header">

          <div>
            <h2>
              Record Payment
            </h2>

            <p>
              {
                purchase.purchaseNumber
              }
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <form
          onSubmit={handleSubmit}
        >

          <div className="purchase-payment-body">

            <div className="purchase-payment-summary">

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
              />

            </div>


            <button
              type="button"
              className="pay-full-balance"
              onClick={() =>
                setAmount(
                  balance.toFixed(2)
                )
              }
            >
              Pay Full Balance
            </button>

          </div>


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
                ? "Saving..."
                : "Record Payment"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default PurchasePaymentModal;