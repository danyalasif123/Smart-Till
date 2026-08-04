import {
  useEffect,
  useState,
} from "react";
import Button from "../../components/common/Button/Button";
import "./Purchases.css";
import toast from "react-hot-toast";
import {
  getPurchases,
  receivePurchase,
  cancelPurchase,
} from "../../services/purchaseService";
import PurchaseModal
  from "../../components/Purchases/PurchaseModal";
  import PurchaseDetailsModal
  from "../../components/Purchases/PurchaseDetailsModal";
  import PurchasePaymentModal
  from "../../components/Purchases/PurchasePaymentModal";

const Purchases = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [purchases, setPurchases] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(null);

const [
  purchaseModalOpen,
  setPurchaseModalOpen,
] = useState(false);
const [
  detailsModalOpen,
  setDetailsModalOpen,
] = useState(false);

const [
  selectedPurchaseId,
  setSelectedPurchaseId,
] = useState(null);
  // ==========================================
  // FETCH PURCHASES
  // ==========================================
const [
  paymentModalOpen,
  setPaymentModalOpen,
] = useState(false);

const [
  paymentPurchase,
  setPaymentPurchase,
] = useState(null);
  const fetchPurchases = async () => {
    try {
      setLoading(true);

      const response =
        await getPurchases();

      setPurchases(
        response.purchases || []
      );

    } catch (error) {
      console.error(
        "Get Purchases Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load purchases."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchPurchases();
  }, []);


  // ==========================================
  // RECEIVE PURCHASE
  // ==========================================

  const handleReceive = async (
    purchase
  ) => {
    const confirmed =
      window.confirm(
        `Receive ${purchase.purchaseNumber}?\n\nThis will add the purchased quantities to inventory.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        purchase._id
      );

      const response =
        await receivePurchase(
          purchase._id
        );

      toast.error(
        response.message ||
          "Purchase received successfully."
      );

      await fetchPurchases();

    } catch (error) {
      console.error(
        "Receive Purchase Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to receive purchase."
      );

    } finally {
      setActionLoading(null);
    }
  };


  // ==========================================
  // CANCEL PURCHASE
  // ==========================================

  const handleCancel = async (
    purchase
  ) => {
    const confirmed =
      window.confirm(
        `Cancel ${purchase.purchaseNumber}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        purchase._id
      );

      const response =
        await cancelPurchase(
          purchase._id
        );

      toast.error(
        response.message ||
          "Purchase cancelled successfully."
      );

      await fetchPurchases();

    } catch (error) {
      console.error(
        "Cancel Purchase Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to cancel purchase."
      );

    } finally {
      setActionLoading(null);
    }
  };


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
    ).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================
  // FILTER PURCHASES
  // ==========================================

  const filteredPurchases =
    purchases.filter(
      (purchase) => {
        const value =
          search
            .trim()
            .toLowerCase();

        if (!value) {
          return true;
        }

        const purchaseNumber =
          purchase.purchaseNumber
            ?.toLowerCase() || "";

        const supplierName =
          purchase.supplierId
            ?.name
            ?.toLowerCase() || "";

        const reference =
          purchase.supplierReference
            ?.toLowerCase() || "";

        const status =
          purchase.status
            ?.toLowerCase() || "";

        return (
          purchaseNumber.includes(
            value
          ) ||
          supplierName.includes(
            value
          ) ||
          reference.includes(
            value
          ) ||
          status.includes(
            value
          )
        );
      }
    );
const handleView = (
  purchase
) => {
  setSelectedPurchaseId(
    purchase._id
  );

  setDetailsModalOpen(true);
};
const handlePayment = (
  purchase
) => {
  setPaymentPurchase(
    purchase
  );

  setPaymentModalOpen(true);
};

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="purchases-page">

      {/* HEADER */}

      <div className="purchases-header">

        <div>
          <h1>Purchases</h1>

          <p>
            Manage supplier purchases and
            stock receiving.
          </p>
        </div>

        <Button onClick={() =>setPurchaseModalOpen(true)}>
          + New Purchase
        </Button>

      </div>


      {/* TOOLBAR */}

      <div className="purchases-toolbar">

        <input
          type="text"
          placeholder="Search purchase, supplier or reference..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <div className="purchase-count">
          {
            filteredPurchases.length
          }{" "}
          purchases
        </div>

      </div>


      {/* CONTENT */}

      <div className="purchases-content">

        {loading ? (

          <div className="purchase-message">
            Loading purchases...
          </div>

        ) : filteredPurchases.length ===
          0 ? (

          <div className="purchase-message">
            No purchases found.
          </div>

        ) : (

          <div className="purchase-table">

            {/* TABLE HEADER */}

            <div className="purchase-table-header">

              <div>Purchase</div>

              <div>Supplier</div>

              <div>Date</div>

              <div>Items</div>

              <div>Total</div>

              <div>Status</div>

              <div>Payment</div>

              <div>Actions</div>

            </div>


            {/* ROWS */}

            {filteredPurchases.map(
              (purchase) => {

                const isPending =
                  purchase.status ===
                  "pending";

                const isProcessing =
                  actionLoading ===
                  purchase._id;

                const totalItems =
                  purchase.items?.reduce(
                    (
                      total,
                      item
                    ) =>
                      total +
                      Number(
                        item.quantity ||
                          0
                      ),
                    0
                  ) || 0;


                return (
                  <div
                    className="purchase-table-row"
                    key={purchase._id}
                  >

                    {/* PURCHASE */}

                    <div>
                      <strong className="purchase-number">
                        {
                          purchase.purchaseNumber
                        }
                      </strong>

                      <span className="purchase-reference">
                        {purchase.supplierReference ||
                          "No reference"}
                      </span>
                    </div>


                    {/* SUPPLIER */}

                    <div>
                      {purchase.supplierId
                        ?.name ||
                        "-"}
                    </div>


                    {/* DATE */}

                    <div>
                      {formatDate(
                        purchase.createdAt
                      )}
                    </div>


                    {/* ITEMS */}

                    <div>
                      {totalItems}
                    </div>


                    {/* TOTAL */}

                    <div className="purchase-total">
                      {formatCurrency(
                        purchase.total
                      )}
                    </div>


                    {/* STATUS */}

                    <div>
                      <span
                        className={`purchase-status ${purchase.status}`}
                      >
                        {
                          purchase.status
                        }
                      </span>
                    </div>


                    {/* PAYMENT */}

                    <div>
                      <span
                        className={`payment-status ${purchase.paymentStatus}`}
                      >
                        {
                          purchase.paymentStatus
                        }
                      </span>
                    </div>


                    {/* ACTIONS */}

                    <div className="purchase-actions">
{purchase.status !== "cancelled" &&
  purchase.paymentStatus !== "paid" && (
    <button
      type="button"
      className="purchase-payment-btn"
      onClick={() =>
        handlePayment(
          purchase
        )
      }
    >
      Pay
    </button>
)}
                     <button
  type="button"
  className="purchase-view-btn"
  onClick={() =>
    handleView(purchase)
  }
>
  View
</button>


                      {isPending && (
                        <>
                          <button
                            type="button"
                            className="purchase-receive-btn"
                            disabled={
                              isProcessing
                            }
                            onClick={() =>
                              handleReceive(
                                purchase
                              )
                            }
                          >
                            {isProcessing
                              ? "..."
                              : "Receive"}
                          </button>

                          <button
                            type="button"
                            className="purchase-cancel-btn"
                            disabled={
                              isProcessing
                            }
                            onClick={() =>
                              handleCancel(
                                purchase
                              )
                            }
                          >
                            Cancel
                          </button>
                        </>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
<PurchaseModal
  isOpen={purchaseModalOpen}
  onClose={() =>
    setPurchaseModalOpen(false)
  }
  onSuccess={fetchPurchases}
/>
<PurchaseDetailsModal
  isOpen={detailsModalOpen}
  purchaseId={
    selectedPurchaseId
  }
  onClose={() => {
    setDetailsModalOpen(false);

    setSelectedPurchaseId(null);
  }}
/>
<PurchasePaymentModal
  isOpen={paymentModalOpen}
  purchase={
    paymentPurchase
  }
  onClose={() => {
    setPaymentModalOpen(false);
    setPaymentPurchase(null);
  }}
  onSuccess={
    fetchPurchases
  }
/>
    </div>
  );
};

export default Purchases;