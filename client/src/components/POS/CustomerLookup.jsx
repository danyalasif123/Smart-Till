import { useState } from "react";
import "./CustomerLookup.css";

import { getCustomerByNumber } from "../../services/customerService";

const CustomerLookup = ({
  selectedCustomer,
  onSelectCustomer,
  onRemoveCustomer,
}) => {
  const [customerNumber, setCustomerNumber] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // FIND CUSTOMER
  // ==========================================

  const handleFindCustomer = async () => {
    const value = customerNumber
      .trim()
      .toUpperCase();

    if (!value) {
      setError("Enter a customer ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await getCustomerByNumber(value);

      onSelectCustomer(
        response.customer
      );

      setCustomerNumber("");
    } catch (error) {
      console.error(
        "Customer Lookup Error:",
        error
      );

      onSelectCustomer(null);

      setError(
        error.response?.data?.message ||
          "Customer not found."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      handleFindCustomer();
    }
  };

  // ==========================================
  // SELECTED CUSTOMER
  // ==========================================

  if (selectedCustomer) {
    return (
      <div className="pos-customer">

        <div className="pos-customer-label">
          Customer
        </div>

        <div className="pos-selected-customer">

          <div className="pos-selected-customer-info">

            <div className="pos-customer-name">
              {selectedCustomer.name}
            </div>

            <div className="pos-customer-number">
              {
                selectedCustomer.customerNumber
              }
            </div>

            <div className="pos-customer-stats">

              <span>
                Orders:{" "}
                {selectedCustomer.totalOrders ||
                  0}
              </span>

              <span>
                Spent: $
                {Number(
                  selectedCustomer.totalSpent ||
                    0
                ).toFixed(2)}
              </span>

            </div>

          </div>

          <button
            type="button"
            className="pos-remove-customer"
            onClick={onRemoveCustomer}
          >
            Remove
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // CUSTOMER SEARCH
  // ==========================================

  return (
    <div className="pos-customer">

      <div className="pos-customer-header">

        <div>
          <div className="pos-customer-label">
            Customer
          </div>

          <div className="pos-customer-optional">
            Optional
          </div>
        </div>

        <span className="pos-walkin">
          Walk-in
        </span>

      </div>

      <div className="pos-customer-search">

        <input
          type="text"
          value={customerNumber}
          placeholder="Enter or scan Customer ID"
          onChange={(e) => {
            setCustomerNumber(
              e.target.value.toUpperCase()
            );

            setError("");
          }}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          disabled={loading}
          onClick={handleFindCustomer}
        >
          {loading
            ? "Finding..."
            : "Find"}
        </button>

      </div>

      {error && (
        <div className="pos-customer-error">
          {error}
        </div>
      )}

    </div>
  );
};

export default CustomerLookup;