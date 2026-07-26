import api from "./api";


// ==========================================
// BUILD REPORT PARAMS
// ==========================================

const buildReportParams = ({
  period = "month",
  startDate = "",
  endDate = "",
} = {}) => {
  const params = {
    period,
  };

  if (period === "custom") {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  return params;
};


// ==========================================
// GET SALES REPORT
// ==========================================

export const getSalesReport = async ({
  period = "month",
  startDate = "",
  endDate = "",
} = {}) => {
  const response = await api.get(
    "/reports/sales",
    {
      params: buildReportParams({
        period,
        startDate,
        endDate,
      }),
    }
  );

  return response.data;
};


// ==========================================
// GET PROFIT REPORT
// ==========================================

export const getProfitReport = async ({
  period = "month",
  startDate = "",
  endDate = "",
} = {}) => {
  const response = await api.get(
    "/reports/profit",
    {
      params: buildReportParams({
        period,
        startDate,
        endDate,
      }),
    }
  );

  return response.data;
};


// ==========================================
// GET PURCHASE REPORT
// ==========================================

export const getPurchaseReport = async ({
  period = "month",
  startDate = "",
  endDate = "",
} = {}) => {
  const response = await api.get(
    "/reports/purchases",
    {
      params: buildReportParams({
        period,
        startDate,
        endDate,
      }),
    }
  );

  return response.data;
};


// ==========================================
// GET INVENTORY REPORT
// ==========================================

export const getInventoryReport = async () => {
  const response = await api.get(
    "/reports/inventory"
  );

  return response.data;
};