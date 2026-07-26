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

// ==========================================
// GET LOW STOCK REPORT
// ==========================================

export const getLowStockReport =
  async () => {

    const response =
      await api.get(
        "/reports/low-stock"
      );

    return response.data;
  };

  // ==========================================
// GET CUSTOMER REPORT
// ==========================================

export const getCustomerReport =
  async (params = {}) => {

    const response =
      await api.get(
        "/reports/customers",
        {
          params,
        }
      );

    return response.data;
  };
  // ==========================================
// GET PRODUCT REPORT
// ==========================================

export const getProductReport =
  async (params = {}) => {

    const response =
      await api.get(
        "/reports/products",
        {
          params,
        }
      );

    return response.data;
  };