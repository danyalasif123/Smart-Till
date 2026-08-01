import { useMemo, useState } from "react";

import "./SaleReturnModal.css";
import { createSaleReturn } from "../../services/saleReturnService";
const SaleReturnModal = ({
  sale,
  onClose,
  onSuccess,
}) => {


  const [reason, setReason] =
    useState("damaged");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [items, setItems] =
    useState(
      sale.items.map((item) => ({

        productId:
          item.productId,

        productName:
          item.productName,

        sku:
          item.sku,

        sold:
          item.quantity,

        returned:
          item.returnedQuantity || 0,

        remaining:
          item.quantity -
          (item.returnedQuantity || 0),

        unitPrice:
          item.unitPrice,

        quantityReturned: 0,

      }))
    );
// ==========================================
// CHANGE RETURN QUANTITY
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
        item.unitPrice,
    0
  );

}, [items]);

// ==========================================
// SUBMIT RETURN
// ==========================================

const handleSubmit = async () => {

  try {

   const selectedItems = items
  .filter((item) => item.quantityReturned > 0)
  .map((item) => ({
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    quantitySold: item.sold,
    quantityReturned: item.quantityReturned,
    unitPrice: item.unitPrice,
    refundAmount:
      item.quantityReturned *
      item.unitPrice,
  }));

    if (selectedItems.length === 0) {

      alert(
        "Please select at least one product."
      );

      return;

    }

    setLoading(true);

    await createSaleReturn({

      saleId: sale._id,

      items: selectedItems,

      reason,

      notes,

    });

    alert(
      "Sale returned successfully."
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
        Return Sale
      </h2>

      <p>
        {sale.saleNumber}
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

{/* =====================================
    BODY
===================================== */}

<div className="sale-return-body">

  {items.map((item, index) => (

    <div
      className="return-product-card"
      key={item.productId}
    >

      {/* PRODUCT HEADER */}

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
            item.unitPrice
          ).toFixed(2)}

        </div>

      </div>

      {/* STATS */}

      <div className="return-stats">

        <div className="return-stat">

          <span>Sold</span>

          <strong>
            {item.sold}
          </strong>

        </div>

        <div className="return-stat returned">

          <span>Returned</span>

          <strong>
            {item.returned}
          </strong>

        </div>

        <div className="return-stat remaining">

          <span>Remaining</span>

          <strong>
            {item.remaining}
          </strong>

        </div>

      </div>

      {/* QUANTITY */}

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

  ))}

  {/* FORM */}

  <div className="sale-return-form">

    <div className="sale-return-field">

      <label>
        Reason
      </label>

    <select
  value={reason}
  onChange={(e) =>
    setReason(e.target.value)
  }
>
  <option value="damaged">
    Damaged
  </option>

  <option value="wrong_product">
    Wrong Product
  </option>

  <option value="customer_changed_mind">
    Customer Changed Mind
  </option>

  <option value="expired">
    Expired
  </option>

  <option value="other">
    Other
  </option>
</select>
    </div>

    <div className="sale-return-field">

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

</div>

{/* FOOTER */}

<div className="sale-return-footer">

  <div>

    <span>
      Total Refund
    </span>

    <strong>

      $
      {totalRefund.toFixed(
        2
      )}

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
        : "Return Sale"}

    </button>

  </div>

</div>
 </div>
 </div>
  );

};

export default SaleReturnModal;