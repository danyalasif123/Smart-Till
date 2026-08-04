import api from "./api";

// ==========================================
// CREATE PURCHASE RETURN
// ==========================================

export const createPurchaseReturn = async (
  data
) => {
  const response = await api.post(
    "/purchase-returns",
    data
  );

  return response.data;
};

// ==========================================
// GET ALL PURCHASE RETURNS
// ==========================================

export const getPurchaseReturns = async () => {
  const response = await api.get(
    "/purchase-returns"
  );

  return response.data;
};

// ==========================================
// GET SINGLE PURCHASE RETURN
// ==========================================

export const getPurchaseReturnById = async (
  id
) => {
  const response = await api.get(
    `/purchase-returns/${id}`
  );

  return response.data;
};