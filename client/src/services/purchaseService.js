import api from "./api";


// ==========================================
// GET ALL PURCHASES
// GET /api/purchases
// ==========================================

export const getPurchases = async () => {
  const response = await api.get(
    "/purchases"
  );

  return response.data;
};


// ==========================================
// GET PURCHASE BY ID
// GET /api/purchases/:id
// ==========================================

export const getPurchaseById = async (
  id
) => {
  const response = await api.get(
    `/purchases/${id}`
  );

  return response.data;
};


// ==========================================
// CREATE PURCHASE
// POST /api/purchases
// ==========================================

export const createPurchase = async (
  data
) => {
  const response = await api.post(
    "/purchases",
    data
  );

  return response.data;
};


// ==========================================
// RECEIVE PURCHASE
// PATCH /api/purchases/:id/receive
// ==========================================

export const receivePurchase = async (
  id
) => {
  const response = await api.patch(
    `/purchases/${id}/receive`
  );

  return response.data;
};


// ==========================================
// CANCEL PURCHASE
// PATCH /api/purchases/:id/cancel
// ==========================================

export const cancelPurchase = async (
  id
) => {
  const response = await api.patch(
    `/purchases/${id}/cancel`
  );

  return response.data;
};
// ==========================================
// RECORD PURCHASE PAYMENT
// PATCH /api/purchases/:id/payment
// ==========================================

export const recordPurchasePayment = async (
  id,
  amount
) => {
  const response = await api.patch(
    `/purchases/${id}/payment`,
    {
      amount,
    }
  );

  return response.data;
};