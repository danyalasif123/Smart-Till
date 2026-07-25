import "./Cart.css";

const Cart = ({
  cart = [],
  paymentMethod,
  onPaymentMethodChange,
  onIncrease,
  onDecrease,
  onRemove,
  onCompleteSale,
  loading = false,
}) => {
  // ==========================================
  // CALCULATE SUBTOTAL
  // ==========================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.sellingPrice) *
        Number(item.quantity),
    0
  );

  // For now
  const discount = 0;
  const tax = 0;

  const total =
    subtotal - discount + tax;

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  return (
    <div className="pos-cart">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="pos-cart-header">
        <div>
          <h2>Current Sale</h2>

          <span>
            {cart.length}{" "}
            {cart.length === 1
              ? "item"
              : "items"}
          </span>
        </div>
      </div>

      {/* =====================================
          ITEMS
      ===================================== */}

      <div className="pos-cart-items">

        {cart.length === 0 ? (
          <div className="pos-empty-cart">

            <div className="pos-empty-cart-title">
              Cart is empty
            </div>

            <div className="pos-empty-cart-text">
              Select or scan a product to
              start a sale.
            </div>

          </div>
        ) : (
          cart.map((item) => (
            <div
              className="pos-cart-item"
              key={item._id}
            >

              {/* PRODUCT */}

              <div className="pos-cart-item-info">

                <div className="pos-cart-item-name">
                  {item.name}
                </div>

                <div className="pos-cart-item-price">
                  {formatMoney(
                    item.sellingPrice
                  )}{" "}
                  / {item.unit || "piece"}
                </div>

              </div>


              {/* QUANTITY */}

              <div className="pos-cart-quantity">

                <button
                  type="button"
                  onClick={() =>
                    onDecrease(item)
                  }
                >
                  −
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  type="button"
                  disabled={
                    item.quantity >=
                    item.stockQuantity
                  }
                  onClick={() =>
                    onIncrease(item)
                  }
                >
                  +
                </button>

              </div>


              {/* ITEM TOTAL */}

              <div className="pos-cart-item-total">

                {formatMoney(
                  Number(
                    item.sellingPrice
                  ) *
                    Number(
                      item.quantity
                    )
                )}

              </div>


              {/* REMOVE */}

              <button
                type="button"
                className="pos-cart-remove"
                title="Remove item"
                onClick={() =>
                  onRemove(item)
                }
              >
                ×
              </button>

            </div>
          ))
        )}

      </div>


      {/* =====================================
          SUMMARY
      ===================================== */}

      <div className="pos-cart-summary">

        <div className="pos-summary-row">
          <span>Subtotal</span>

          <span>
            {formatMoney(subtotal)}
          </span>
        </div>


        <div className="pos-summary-row">
          <span>Discount</span>

          <span>
            {formatMoney(discount)}
          </span>
        </div>


        <div className="pos-summary-row">
          <span>Tax</span>

          <span>
            {formatMoney(tax)}
          </span>
        </div>


        <div className="pos-summary-row pos-summary-total">

          <span>Total</span>

          <span>
            {formatMoney(total)}
          </span>

        </div>

      </div>


      {/* =====================================
          PAYMENT METHOD
      ===================================== */}

      <div className="pos-payment">

        <div className="pos-payment-label">
          Payment Method
        </div>

        <div className="pos-payment-options">

          <button
            type="button"
            className={
              paymentMethod === "cash"
                ? "active"
                : ""
            }
            onClick={() =>
              onPaymentMethodChange(
                "cash"
              )
            }
          >
            Cash
          </button>


          <button
            type="button"
            className={
              paymentMethod === "card"
                ? "active"
                : ""
            }
            onClick={() =>
              onPaymentMethodChange(
                "card"
              )
            }
          >
            Card
          </button>

        </div>

      </div>


      {/* =====================================
          COMPLETE SALE
      ===================================== */}

      <button
        type="button"
        className="pos-complete-sale"
        disabled={
          cart.length === 0 ||
          loading
        }
        onClick={onCompleteSale}
      >
        {loading
          ? "Processing..."
          : `Complete Sale • ${formatMoney(
              total
            )}`}
      </button>

    </div>
  );
};

export default Cart;