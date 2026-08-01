import { useEffect, useMemo, useState } from "react";
import "./SaleReturns.css";

import Search from "../../components/common/Search/Search";

import {
  getSaleReturns,
} from "../../services/saleReturnService";

import SaleReturnDetailsModal from "../../components/SaleReturns/SaleReturnDetailsModal";

const SaleReturns = () => {

  const [saleReturns, setSaleReturns] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedReturn, setSelectedReturn] =
    useState(null);

  // ==========================================
  // FETCH RETURNS
  // ==========================================

  const fetchSaleReturns = async () => {

    try {

      setLoading(true);

      const response =
        await getSaleReturns();

      setSaleReturns(response || []);

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to load sale returns."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchSaleReturns();

  }, []);

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (value) => {

    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
      }
    ).format(Number(value || 0));

  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    return new Intl.DateTimeFormat(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    ).format(new Date(date));

  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredReturns =
    useMemo(() => {

      const value =
        search.toLowerCase().trim();

      if (!value)
        return saleReturns;

      return saleReturns.filter(
        (item) => {

          return (

            item.returnNumber
              ?.toLowerCase()
              .includes(value)

            ||

            item.saleId?.saleNumber
              ?.toLowerCase()
              .includes(value)

            ||

            item.customerId?.name
              ?.toLowerCase()
              .includes(value)

            ||

            item.reason
              ?.toLowerCase()
              .includes(value)

            ||

            item.returnedBy?.name
              ?.toLowerCase()
              .includes(value)

          );

        }

      );

    }, [saleReturns, search]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalRefund =
    saleReturns.reduce(

      (sum, item) =>

        sum +
        Number(item.totalRefund),

      0

    );

  const totalProducts =
    saleReturns.reduce(

      (sum, item) =>

        sum +

        item.items.reduce(

          (s, i) =>

            s +
            i.quantityReturned,

          0

        ),

      0

    );

  return (

    <div className="sale-returns-page">

      {/* HEADER */}

      <div className="sale-returns-header">

        <div>

          <h1>
            Sale Returns
          </h1>

          <p>
            View and manage returned sales.
          </p>

        </div>

        <button
          className="sale-returns-refresh-btn"
          onClick={fetchSaleReturns}
        >

          {loading
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>

      {/* SUMMARY */}

      <div className="sale-returns-summary">

        <div className="sale-returns-card">

          <span>
            Total Returns
          </span>

          <strong>
            {saleReturns.length}
          </strong>

        </div>

        <div className="sale-returns-card">

          <span>
            Products Returned
          </span>

          <strong>
            {totalProducts}
          </strong>

        </div>

        <div className="sale-returns-card">

          <span>
            Total Refunded
          </span>

          <strong>

            {formatMoney(
              totalRefund
            )}

          </strong>

        </div>

      </div>

      {/* SEARCH */}

      <div className="sale-returns-toolbar">

        <Search

          placeholder="Search return, sale, customer..."

          value={search}

          onChange={(e)=>

            setSearch(
              e.target.value
            )

          }

        />

        <div>

          {filteredReturns.length}
          {" "}
          Returns

        </div>

      </div>

      {/* TABLE */}

      <div className="sale-returns-table-wrapper">

        <table className="sale-returns-table">

          <thead>

            <tr>

              <th>
                Return No
              </th>

              <th>
                Sale No
              </th>

              <th>
                Date
              </th>

              <th>
                Customer
              </th>

              <th>
                Reason
              </th>

              <th>
                Refund
              </th>

              <th>
                Cashier
              </th>

              <th>

              </th>

            </tr>

          </thead>

          <tbody>

            {

              loading ?

              (

                <tr>

                  <td
                    colSpan="8"
                    className="sale-returns-empty"
                  >

                    Loading...

                  </td>

                </tr>

              )

              :

              filteredReturns.length===0 ?

              (

                <tr>

                  <td
                    colSpan="8"
                    className="sale-returns-empty"
                  >

                    No sale returns found.

                  </td>

                </tr>

              )

              :

              filteredReturns.map(

                (item)=>(

                  <tr
                    key={item._id}
                  >

                    <td>

                      {item.returnNumber}

                    </td>

                    <td>

                      {item.saleId?.saleNumber}

                    </td>

                    <td>

                      {formatDate(
                        item.createdAt
                      )}

                    </td>

                    <td>

                      {

                        item.customerId

                        ?

                        item.customerId.name

                        :

                        "Walk-in"

                      }

                    </td>

                   <td>
  <span className="sale-return-reason">
    {item.reason.replaceAll("_", " ")}
  </span>
</td>

                    <td>

                      <strong>

                        {formatMoney(
                          item.totalRefund
                        )}

                      </strong>

                    </td>

                    <td>

                      {item.returnedBy?.name}

                    </td>

                    <td>

                      <button

                        className="sale-return-view-btn"

                        onClick={()=>setSelectedReturn(item)}

                      >

                        View

                      </button>

                    </td>

                  </tr>

                )

              )

            }

          </tbody>

        </table>

      </div>

      {

        selectedReturn &&

        <SaleReturnDetailsModal

          saleReturn={selectedReturn}

          onClose={()=>

            setSelectedReturn(null)

          }

        />

      }

    </div>

  );

};

export default SaleReturns;