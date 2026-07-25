import { useEffect, useMemo, useState } from "react";
import "./Sales.css";

import Search from "../../components/common/Search/Search";
import { getSales } from "../../services/saleService";
import SaleDetailsModal from "../../components/POS/SaleDetailsModal";
const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  // ==========================================
  // FETCH SALES
  // ==========================================

  const fetchSales = async () => {
    try {
      setLoading(true);

      const response = await getSales();

      setSales(response.sales || []);
    } catch (error) {
      console.error(
        "Failed to fetch sales:",
        error
      );

      alert(
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
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return sales;
    }

    return sales.filter((sale) => {
      const saleNumber =
        sale.saleNumber
          ?.toLowerCase() || "";

      const customerName =
        sale.customerId?.name
          ?.toLowerCase() || "";

      const customerNumber =
        sale.customerId?.customerNumber
          ?.toLowerCase() || "";

      const cashierName =
        sale.createdBy?.name
          ?.toLowerCase() || "";

      const paymentMethod =
        sale.paymentMethod
          ?.toLowerCase() || "";

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
  // TOTAL SALES VALUE
  // ==========================================

  const totalRevenue = sales.reduce(
    (total, sale) =>
      total + Number(sale.total || 0),
    0
  );

  // ==========================================
  // TOTAL ITEMS SOLD
  // ==========================================

  const totalItems = sales.reduce(
    (total, sale) => {
      const saleItems =
        sale.items?.reduce(
          (itemTotal, item) =>
            itemTotal +
            Number(item.quantity || 0),
          0
        ) || 0;

      return total + saleItems;
    },
    0
  );

  // ==========================================
  // VIEW SALE
  // ==========================================
const handleView = (sale) => {
  setSelectedSale(sale);
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
            View and manage completed sales
            for your business.
          </p>
        </div>

        <button
          type="button"
          className="sales-refresh-btn"
          onClick={fetchSales}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

      {/* =====================================
          SUMMARY
      ===================================== */}

      <div className="sales-summary">

        <div className="sales-summary-card">
          <span>Total Sales</span>

          <strong>
            {sales.length}
          </strong>
        </div>

        <div className="sales-summary-card">
          <span>Items Sold</span>

          <strong>
            {totalItems}
          </strong>
        </div>

        <div className="sales-summary-card">
          <span>Total Revenue</span>

          <strong>
            {formatMoney(totalRevenue)}
          </strong>
        </div>

      </div>

      {/* =====================================
          TOOLBAR
      ===================================== */}

      <div className="sales-toolbar">

        <Search
          placeholder="Search sale, customer, cashier or payment..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
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
              <th></th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="sales-empty"
                >
                  Loading sales...
                </td>
              </tr>
            ) : filteredSales.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
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
                      Number(
                        item.quantity || 0
                      ),
                    0
                  ) || 0;

                return (
                  <tr key={sale._id}>

                    {/* SALE NUMBER */}

                    <td>
                      <span className="sale-number">
                        {sale.saleNumber}
                      </span>
                    </td>

                    {/* DATE */}

                    <td>
                      {formatDate(
                        sale.createdAt
                      )}
                    </td>

                    {/* CUSTOMER */}

                    <td>

                      {sale.customerId ? (
                        <div className="sales-customer">

                          <span>
                            {sale.customerId
                              .name ||
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

                    <td>
                      {sale.createdBy?.name ||
                        "-"}
                    </td>

                    {/* PAYMENT */}

                    <td>

                      <span
                        className={`sales-payment ${
                          sale.paymentMethod ||
                          ""
                        }`}
                      >
                        {sale.paymentMethod ||
                          "-"}
                      </span>

                    </td>

                    {/* ITEMS */}

                    <td>
                      {itemCount}
                    </td>

                    {/* TOTAL */}

                    <td>
                      <strong>
                        {formatMoney(
                          sale.total
                        )}
                      </strong>
                    </td>

                    {/* VIEW */}

                    <td>
                      <button
                        type="button"
                        className="sales-view-btn"
                        onClick={() =>
                          handleView(sale)
                        }
                      >
                        View
                      </button>
                    </td>

                  </tr>
                );
              })
            )}

          </tbody>

        </table>

      </div>
{selectedSale && (
  <SaleDetailsModal
    sale={selectedSale}
    onClose={() =>
      setSelectedSale(null)
    }
  />
)}
    </div>
  );
};

export default Sales;