import api from "./api";

// ==========================================
// CREATE SALE
// ==========================================

export const createSale = async (saleData) => {
  const response = await api.post(
    "/sales",
    saleData
  );

  return response.data;
};


// ==========================================
// GET ALL SALES
// ==========================================

export const getSales = async () => {
  const response = await api.get(
    "/sales"
  );

  return response.data;
};


// ==========================================
// GET SALE BY ID
// ==========================================

export const getSaleById = async (id) => {
  const response = await api.get(
    `/sales/${id}`
  );

  return response.data;
};


// ==========================================
// GET CUSTOMER SALES
// ==========================================

export const getCustomerSales = async (
  customerId
) => {
  const response = await api.get(
    `/sales/customer/${customerId}`
  );

  return response.data;
};