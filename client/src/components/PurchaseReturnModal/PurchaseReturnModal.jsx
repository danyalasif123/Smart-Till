import {
  useEffect,
  useMemo,
  useState,
} from "react";
import "./PurchaseReturnModal.css";

import { createPurchaseReturn } from "../../services/purchaseReturnService";

const PurchaseReturnModal = ({
  purchase,
  onClose,
  onSuccess,
}) => {
   if (!purchase) {
    return null;
  }

  const [reason, setReason] =
    useState("damaged");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);
useEffect(() => {

  if (!purchase) return;

  setItems(

    purchase.items.map((item) => ({

      productId:
        item.productId,

      productName:
        item.productName,

      sku:
        item.sku,

      purchased:
        item.quantity,

      returned:
        item.returnedQuantity || 0,

      remaining:
        item.quantity -
        (item.returnedQuantity || 0),

      unitCost:
        item.unitCost,

      quantityReturned: 0,

    }))

  );

}, [purchase]);
const [items, setItems] =
  useState([]);

  // ==========================================
  // CHANGE QUANTITY
  // ==========================================

  const handleQuantityChange = (
    index,
    value
  ) => {

    const quantity =
      Number(value);

    const updated = [...items];

    updated[index].quantityReturned =
      Math.max(
        0,
        Math.min(
          quantity || 0,
          updated[index].remaining
        )
      );

    setItems(updated);

  };

  // ==========================================
  // TOTAL REFUND
  // ==========================================

  const totalRefund = useMemo(() => {

    return items.reduce(

      (total, item) =>

        total +

        item.quantityReturned *

        item.unitCost,

      0

    );

  }, [items]);

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async () => {

    try {

      const selectedItems =
        items

          .filter(
            (item) =>
              item.quantityReturned > 0
          )

          .map((item) => ({

            productId:
              item.productId,

            quantityReturned:
              item.quantityReturned,

          }));

      if (
        selectedItems.length === 0
      ) {

        alert(
          "Please select at least one product."
        );

        return;

      }

      setLoading(true);

      await createPurchaseReturn({

        purchaseId:
          purchase._id,

        items:
          selectedItems,

        reason,

        notes,

      });

      alert(
        "Purchase returned successfully."
      );

      onSuccess();

    }

    catch (error) {

      console.error(error);

      alert(

        error.response?.data
          ?.message ||

        "Failed to process return."

      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div className="sale-return-overlay">

      <div className="sale-return-modal">

        {/* HEADER */}

        <div className="sale-return-header">

          <div>

            <h2>

              Return Purchase

            </h2>

            <p>

              {purchase.purchaseNumber}

            </p>

          </div>

          <button

            className="sale-return-close"

            onClick={onClose}

          >

            ✕

          </button>

        </div>

        {/* BODY */}

        <div className="sale-return-body">

          {items.map(
            (item, index) => (

              <div
                className="return-product-card"
                key={item.productId}
              >

                <div className="return-product-header">

                  <div>

                    <h3>
                      {item.productName}
                    </h3>

                    <span>
                      SKU: {item.sku || "-"}
                    </span>

                  </div>

                  <div className="return-refund">

                    $

                    {(
                      item.quantityReturned *
                      item.unitCost
                    ).toFixed(2)}

                  </div>

                </div>

                <div className="return-stats">

                  <div className="return-stat">

                    <span>

                      Purchased

                    </span>

                    <strong>

                      {item.purchased}

                    </strong>

                  </div>

                  <div className="return-stat returned">

                    <span>

                      Returned

                    </span>

                    <strong>

                      {item.returned}

                    </strong>

                  </div>

                  <div className="return-stat remaining">

                    <span>

                      Remaining

                    </span>

                    <strong>

                      {item.remaining}

                    </strong>

                  </div>

                </div>

                <div className="return-quantity">

                  <button

                    type="button"

                    onClick={() =>

                      handleQuantityChange(

                        index,

                        item.quantityReturned - 1

                      )

                    }

                  >

                    −

                  </button>

                  <div className="return-qty-value">

                    {item.quantityReturned}

                  </div>

                  <button

                    type="button"

                    onClick={() =>

                      handleQuantityChange(

                        index,

                        item.quantityReturned + 1

                      )

                    }

                  >

                    +

                  </button>

                </div>

              </div>

            )
          )}

          <div className="sale-return-form">

            <label>

              Reason

            </label>

            <select

              value={reason}

              onChange={(e) =>

                setReason(
                  e.target.value
                )

              }

            >

              <option value="damaged">
                Damaged
              </option>

              <option value="wrong_product">
                Wrong Product
              </option>

              <option value="supplier_error">
                Supplier Error
              </option>

              <option value="expired">
                Expired
              </option>

              <option value="other">
                Other
              </option>

            </select>

            <label>

              Notes

            </label>

            <textarea

              rows="3"

              value={notes}

              onChange={(e) =>

                setNotes(
                  e.target.value
                )

              }

            />

          </div>

        </div>

        {/* FOOTER */}

        <div className="sale-return-footer">

          <div>

            <span>

              Total Refund

            </span>

            <strong>

              ${totalRefund.toFixed(2)}

            </strong>

          </div>

          <div className="sale-return-buttons">

            <button
              onClick={onClose}
            >

              Cancel

            </button>

            <button

              className="sale-return-save"

              onClick={handleSubmit}

              disabled={
                loading ||
                totalRefund === 0
              }

            >

              {loading
                ? "Returning..."
                : "Return Purchase"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );

};

export default PurchaseReturnModal;