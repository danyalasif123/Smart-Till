import {
  useEffect,
  useState,
} from "react";

import "./Reports.css";
import toast from "react-hot-toast";

// ==========================================
// COMPONENTS
// ==========================================

import ReportTabs from "../../components/Reports/ReportTabs";
import ReportFilter from "../../components/Reports/ReportFilter";

import SalesReport from "../../components/Reports/SalesReport";
import ProfitReport from "../../components/Reports/ProfitReport";
import PurchaseReport from "../../components/Reports/PurchaseReport";
import InventoryReport from "../../components/Reports/InventoryReport";
import LowStockReport from "../../components/Reports/LowStockReport";
import CustomerReport from "../../components/Reports/CustomerReport";
import ProductReport from "../../components/Reports/ProductReport";
import CashierReport from "../../components/Reports/CashierReport";
import ReportActions from "../../components/Reports/ReportActions";

// ==========================================
// SERVICES
// ==========================================

import {
  getSalesReport,
  getProfitReport,
  getPurchaseReport,
  getInventoryReport,
  getLowStockReport,
  getCustomerReport,
  getProductReport,
  getCashierReport,
} from "../../services/reportService";


const Reports = () => {

  // ==========================================
  // REPORT TYPE
  // ==========================================

  const [
    reportType,
    setReportType,
  ] = useState("sales");


  // ==========================================
  // DATE FILTER
  // ==========================================

  const [
    period,
    setPeriod,
  ] = useState("month");

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");


  // ==========================================
  // REPORT DATA
  // ==========================================

  const [
    report,
    setReport,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);


  // ==========================================
  // FETCH REPORT
  // ==========================================

  const fetchReport = async ({
    type = reportType,
    selectedPeriod = period,
  } = {}) => {

    try {

      // ======================================
      // VALIDATE CUSTOM DATE RANGE
      // ======================================

      if (
        selectedPeriod === "custom"
      ) {

        if (
          !startDate ||
          !endDate
        ) {

          toast.error(
            "Please select start and end dates."
          );

          return;
        }


        if (
          new Date(startDate) >
          new Date(endDate)
        ) {

          toast.error(
            "Start date cannot be after end date."
          );

          return;
        }
      }


      setLoading(true);


      // ======================================
      // DATE PARAMS
      // ======================================

      const params = {
        period:
          selectedPeriod,

        startDate:
          selectedPeriod === "custom"
            ? startDate
            : undefined,

        endDate:
          selectedPeriod === "custom"
            ? endDate
            : undefined,
      };


      let response;


      // ======================================
      // SALES
      // ======================================

     // ======================================
// SALES
// ======================================

if (type === "sales") {

  response = await getSalesReport(params);

  // DEBUG: check what backend returns
  console.log("SALES REPORT RESPONSE:", response);

}


      // ======================================
      // PROFIT
      // ======================================

      else if (
        type === "profit"
      ) {

        response =
          await getProfitReport(
            params
          );

      }


      // ======================================
      // PURCHASES
      // ======================================

      else if (
        type === "purchases"
      ) {

        response =
          await getPurchaseReport(
            params
          );

      }


      // ======================================
      // INVENTORY
      // ======================================

      else if (
        type === "inventory"
      ) {

        response =
          await getInventoryReport();

      }


      // ======================================
      // LOW STOCK
      // ======================================

      else if (
        type === "low-stock"
      ) {

        response =
          await getLowStockReport();

      }


      // ======================================
      // CUSTOMERS
      // ======================================

      else if (
        type === "customers"
      ) {

        response =
          await getCustomerReport(
            params
          );

      }


      // ======================================
      // PRODUCTS
      // ======================================

      else if (
        type === "products"
      ) {

        response =
          await getProductReport(
            params
          );

      }


      // ======================================
      // CASHIERS
      // ======================================

      else if (
        type === "cashiers"
      ) {

        response =
          await getCashierReport(
            params
          );

      }


      // ======================================
      // INVALID REPORT
      // ======================================

      else {

        throw new Error(
          "Invalid report type"
        );

      }


      setReport(
        response
      );

    } catch (error) {

      console.error(
        "Report Error:",
        error
      );

      setReport(null);

      toast.error(
        error.response?.data
          ?.message ||
        error.message ||
        "Failed to load report."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    fetchReport({
      type: "sales",
      selectedPeriod: "month",
    });

    // eslint-disable-next-line
  }, []);


  // ==========================================
  // CHANGE REPORT TYPE
  // ==========================================

  const handleReportChange = (
    type
  ) => {

    setReportType(
      type
    );

    setReport(
      null
    );


    // ======================================
    // CUSTOM DATE RANGE
    // ======================================

    if (
      period === "custom" &&
      (
        !startDate ||
        !endDate
      )
    ) {

      return;

    }


    fetchReport({
      type,
      selectedPeriod:
        period,
    });

  };


  // ==========================================
  // CHANGE PERIOD
  // ==========================================

  const handlePeriodChange = (
    newPeriod
  ) => {

    setPeriod(
      newPeriod
    );


    // ======================================
    // CUSTOM REQUIRES DATES
    // ======================================

    if (
      newPeriod === "custom"
    ) {

      setReport(
        null
      );

      return;

    }


    fetchReport({
      type:
        reportType,

      selectedPeriod:
        newPeriod,
    });

  };


  // ==========================================
  // APPLY CUSTOM RANGE
  // ==========================================

  const handleCustomApply = () => {

    fetchReport({
      type:
        reportType,

      selectedPeriod:
        "custom",
    });

  };


  // ==========================================
  // RENDER SELECTED REPORT
  // ==========================================

  const renderReport = () => {

    if (
      loading ||
      !report
    ) {

      return null;

    }


    switch (
      reportType
    ) {

      // ======================================
      // SALES
      // ======================================

      case "sales":

        return (
          <SalesReport
            report={report}
          />
        );


      // ======================================
      // PROFIT
      // ======================================

      case "profit":

        return (
          <ProfitReport
            report={report}
          />
        );


      // ======================================
      // PURCHASES
      // ======================================

      case "purchases":

        return (
          <PurchaseReport
            report={report}
          />
        );


      // ======================================
      // INVENTORY
      // ======================================

      case "inventory":

        return (
          <InventoryReport
            report={report}
          />
        );


      // ======================================
      // LOW STOCK
      // ======================================

      case "low-stock":

        return (
          <LowStockReport
            report={report}
          />
        );


      // ======================================
      // CUSTOMERS
      // ======================================

      case "customers":

        return (
          <CustomerReport
            report={report}
          />
        );


      // ======================================
      // PRODUCTS
      // ======================================

      case "products":

        return (
          <ProductReport
            report={report}
          />
        );


      // ======================================
      // CASHIERS
      // ======================================

      case "cashiers":

        return (
          <CashierReport
            report={report}
          />
        );


      default:

        return null;
    }
  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="reports-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="reports-header">

  <div>

    <h1>
      Reports
    </h1>

    <p>
      Analyze sales,
      profitability, inventory
      and business performance.
    </p>

  </div>


  <ReportActions
    report={report}
    reportType={reportType}
    period={period}
  />

</div>


      {/* =====================================
          REPORT TABS
      ===================================== */}

      <ReportTabs
        reportType={
          reportType
        }
        onChange={
          handleReportChange
        }
      />


      {/* =====================================
          FILTER
      ===================================== */}

      <ReportFilter
        period={
          period
        }
        startDate={
          startDate
        }
        endDate={
          endDate
        }
        setStartDate={
          setStartDate
        }
        setEndDate={
          setEndDate
        }
        onPeriodChange={
          handlePeriodChange
        }
        onApply={
          handleCustomApply
        }
        loading={
          loading
        }
        dateRange={
          report?.dateRange
        }
      />


      {/* =====================================
          LOADING
      ===================================== */}

      {loading && (

        <div className="reports-loading">

          Loading report...

        </div>

      )}


      {/* =====================================
          REPORT CONTENT
      ===================================== */}

      {renderReport()}


      {/* =====================================
          NO DATA
      ===================================== */}

      {!loading &&
        !report && (

        <div className="reports-loading">

          {period === "custom"
            ? "Select a custom date range and click Apply."
            : "No report data available."}

        </div>

      )}

    </div>

  );
};

export default Reports;