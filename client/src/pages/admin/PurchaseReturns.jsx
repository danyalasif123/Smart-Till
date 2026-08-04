import { useEffect, useMemo, useState } from "react";
import "./PurchaseReturns.css";

import Search from "../../components/common/Search/Search";
import toast from "react-hot-toast";

import {
  getPurchaseReturns,
} from "../../services/purchaseReturnService";

import PurchaseReturnDetailsModal from "../../components/PurchaseReturnModal/PurchaseReturnDetailsModal";

const PurchaseReturns = () => {

  const [purchaseReturns, setPurchaseReturns] =
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

  const fetchPurchaseReturns = async () => {

    try {

      setLoading(true);

      const response =
        await getPurchaseReturns();

      setPurchaseReturns(
        response || []
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load purchase returns."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchPurchaseReturns();

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
        return purchaseReturns;

      return purchaseReturns.filter(
        (item) => {

          return (

            item.returnNumber
              ?.toLowerCase()
              .includes(value)

            ||

            item.purchaseId?.purchaseNumber
              ?.toLowerCase()
              .includes(value)

            ||

            item.supplierId?.name
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

    }, [purchaseReturns, search]);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalRefund =
    purchaseReturns.reduce(

      (sum, item) =>

        sum +
        Number(item.totalRefund),

      0

    );

  const totalProducts =
    purchaseReturns.reduce(

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

    <div className="purchase-returns-page">

      {/* HEADER */}

      <div className="purchase-returns-header">

        <div>

          <h1>
            Purchase Returns
          </h1>

          <p>
            View and manage returned purchases.
          </p>

        </div>

        <button
          className="purchase-returns-refresh-btn"
          onClick={fetchPurchaseReturns}
        >

          {loading
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>

      {/* SUMMARY */}

      <div className="purchase-returns-summary">

        <div className="purchase-returns-card">

          <span>
            Total Returns
          </span>

          <strong>
            {purchaseReturns.length}
          </strong>

        </div>

        <div className="purchase-returns-card">

          <span>
            Products Returned
          </span>

          <strong>
            {totalProducts}
          </strong>

        </div>

        <div className="purchase-returns-card">

          <span>
            Total Refund
          </span>

          <strong>

            {formatMoney(
              totalRefund
            )}

          </strong>

        </div>

      </div>

      {/* SEARCH */}

      <div className="purchase-returns-toolbar">

        <Search

          placeholder="Search return, purchase, supplier..."

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

      <div className="purchase-returns-table-wrapper">

        <table className="purchase-returns-table">

          <thead>

            <tr>

              <th>Return No</th>

              <th>Purchase No</th>

              <th>Date</th>

              <th>Supplier</th>

              <th>Reason</th>

              <th>Refund</th>

              <th>User</th>

              <th></th>

            </tr>

          </thead>

          <tbody>

            {

              loading ?

              (

                <tr>

                  <td
                    colSpan="8"
                    className="purchase-returns-empty"
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
                    className="purchase-returns-empty"
                  >

                    No purchase returns found.

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

                      {item.purchaseId?.purchaseNumber}

                    </td>

                    <td>

                      {formatDate(
                        item.createdAt
                      )}

                    </td>

                    <td>

                      {

                        item.supplierId?.name ||
                        "-"

                      }

                    </td>

                    <td>

                      <span className="purchase-return-reason">

                        {item.reason.replaceAll("_"," ")}

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

                        className="purchase-return-view-btn"

                        onClick={()=>

                          setSelectedReturn(item)

                        }

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

        <PurchaseReturnDetailsModal

          purchaseReturn={selectedReturn}

          onClose={()=>

            setSelectedReturn(null)

          }

        />

      }

    </div>

  );

};

export default PurchaseReturns;