import { useEffect, useMemo, useState } from "react";
import "./Sales.css";
import { Toaster, toast } from "react-hot-toast";
import Search from "../../components/common/Search/Search";
import { getSales } from "../../services/saleService";
import SaleDetailsModal from "../../components/POS/SaleDetailsModal";
import SaleReturnModal from "../../components/POS/SaleReturnModal";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [returnSale, setReturnSale] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  // ==========================================
  // FETCH SALES
  // ==========================================

  const fetchSales = async () => {
    try {
      setLoading(true);

      const response = await getSales();

      setSales(response.sales || []);
    } catch (error) {
      console.error("Failed to fetch sales:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load sales."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD SALES
  // ==========================================

  useEffect(() => {
    fetchSales();
  }, []);

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount || 0));
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // ==========================================
  // FILTER SALES
  // ==========================================

  const filteredSales = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return sales;
    }

    return sales.filter((sale) => {
      const saleNumber =
        sale.saleNumber?.toLowerCase() || "";

      const customerName =
        sale.customerId?.name?.toLowerCase() || "";

      const customerNumber =
        sale.customerId?.customerNumber?.toLowerCase() ||
        "";

      const cashierName =
        sale.createdBy?.name?.toLowerCase() || "";

      const paymentMethod =
        sale.paymentMethod?.toLowerCase() || "";

      return (
        saleNumber.includes(value) ||
        customerName.includes(value) ||
        customerNumber.includes(value) ||
        cashierName.includes(value) ||
        paymentMethod.includes(value)
      );
    });
  }, [sales, search]);

  // ==========================================
  // TOTAL REFUNDED VALUE
  // ==========================================

  const totalRefund = sales.reduce((total, sale) => {
    const refund =
      sale.items?.reduce(
        (sum, item) =>
          sum +
          Number(item.returnedQuantity || 0) *
            Number(item.unitPrice || 0),
        0
      ) || 0;

    return total + refund;
  }, 0);

  // ==========================================
  // NET REVENUE
  // ==========================================

  const totalRevenue =
    sales.reduce(
      (total, sale) =>
        total + Number(sale.total || 0),
      0
    ) - totalRefund;

  // ==========================================
  // TOTAL ITEMS SOLD
  // ==========================================

  const totalItems = sales.reduce((total, sale) => {
    const sold =
      sale.items?.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0),
        0
      ) || 0;

    const returned =
      sale.items?.reduce(
        (sum, item) =>
          sum + Number(item.returnedQuantity || 0),
        0
      ) || 0;

    return total + (sold - returned);
  }, 0);

  // ==========================================
  // VIEW SALE
  // ==========================================

  const handleView = (sale) => {
    setSelectedSale(sale);
  };

  // ==========================================
  // RETURN SALE
  // ==========================================

  const handleReturnClick = (sale) => {
    setReturnSale(sale);
    setShowReturnModal(true);
  };

  return (
    <div className="sales-page">
      {/* =====================================
          HEADER
      ===================================== */}

      <div className="sales-header">
        <div>
          <h1>Sales History</h1>

          <p>
            View and manage completed sales for your
            business.
          </p>
        </div>

        <button
          type="button"
          className="sales-refresh-btn"
          onClick={fetchSales}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================
          SUMMARY
      ===================================== */}

      <div className="sales-summary">
        <div className="sales-summary-card">
          <span>Total Sales</span>
          <strong>{sales.length}</strong>
        </div>

        <div className="sales-summary-card">
          <span>Items Sold</span>
          <strong>{totalItems}</strong>
        </div>

        <div className="sales-summary-card">
          <span>Net Revenue</span>
          <strong>{formatMoney(totalRevenue)}</strong>
        </div>

        <div className="sales-summary-card">
          <span>Refunded</span>
          <strong>{formatMoney(totalRefund)}</strong>
        </div>
      </div>

      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="sales-toolbar">
        <Search
          placeholder="Search sale, customer, cashier or payment..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <div className="sales-result-count">
          {filteredSales.length} sales
        </div>
      </div>

      {/* =====================================
          TABLE
      ===================================== */}

      <div className="sales-table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Sale No.</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Cashier</th>
              <th>Payment</th>
              <th>Items</th>
              <th>Total</th>
              <th>Refunded</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="10"
                  className="sales-empty"
                >
                  Loading sales...
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td
                  colSpan="10"
                  className="sales-empty"
                >
                  No sales found.
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => {
                const itemCount =
                  sale.items?.reduce(
                    (total, item) =>
                      total +
                      (Number(item.quantity || 0) -
                        Number(
                          item.returnedQuantity || 0
                        )),
                    0
                  ) || 0;

                const refundedAmount =
                  sale.items?.reduce(
                    (total, item) =>
                      total +
                      Number(
                        item.returnedQuantity || 0
                      ) *
                        Number(item.unitPrice || 0),
                    0
                  ) || 0;

                const formattedStatus = sale.status
                  ? sale.status
                      .replaceAll("_", " ")
                      .replace(/\b\w/g, (character) =>
                        character.toUpperCase()
                      )
                  : "-";

                return (
                  <tr key={sale._id}>
                    {/* SALE NUMBER */}

                    <td>
                      <span className="sale-number">
                        {sale.saleNumber}
                      </span>
                    </td>

                    {/* DATE */}

                    <td>{formatDate(sale.createdAt)}</td>

                    {/* CUSTOMER */}

                    <td>
                      {sale.customerId ? (
                        <div className="sales-customer">
                          <span>
                            {sale.customerId.name ||
                              "Customer"}
                          </span>

                          <small>
                            {
                              sale.customerId
                                .customerNumber
                            }
                          </small>
                        </div>
                      ) : (
                        <span className="sales-walkin">
                          Walk-in
                        </span>
                      )}
                    </td>

                    {/* CASHIER */}

                    <td>{sale.createdBy?.name || "-"}</td>

                    {/* PAYMENT */}

                    <td>
                      <span
                        className={`sales-payment ${
                          sale.paymentMethod || ""
                        }`}
                      >
                        {sale.paymentMethod || "-"}
                      </span>
                    </td>

                    {/* ITEMS */}

                    <td>{itemCount}</td>

                    {/* TOTAL */}

                    <td>
                      <strong>
                        {formatMoney(sale.total)}
                      </strong>
                    </td>

                    {/* REFUNDED */}

                    <td>
                      {formatMoney(refundedAmount)}
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`sale-status ${
                          sale.status || ""
                        }`}
                      >
                        {formattedStatus}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="sales-actions">
                        <button
                          type="button"
                          className="sales-view-btn"
                          onClick={() =>
                            handleView(sale)
                          }
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="sales-return-btn"
                          disabled={
                            sale.status === "returned"
                          }
                          onClick={() =>
                            handleReturnClick(sale)
                          }
                        >
                          {sale.status === "returned"
                            ? "✓ Returned"
                            : sale.status ===
                                "partially_returned"
                              ? "↺ Return More"
                              : "Return"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================
          VIEW SALE MODAL
      ===================================== */}

      {selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}

      {/* =====================================
          RETURN SALE MODAL
      ===================================== */}

      {showReturnModal && returnSale && (
        <SaleReturnModal
          sale={returnSale}
          onClose={() => {
            setShowReturnModal(false);
            setReturnSale(null);
          }}
          onSuccess={() => {
            fetchSales();
            setShowReturnModal(false);
            setReturnSale(null);
          }}
        />
      )}
    </div>
  );
};

export default Sales;
