import api from "./api";

// ==========================================
// GET ALL INVENTORY
// ==========================================

export const getInventory = async () => {
  const response = await api.get(
    "/inventory"
  );

  return response.data;
};


// ==========================================
// GET LOW STOCK PRODUCTS
// ==========================================

export const getLowStockProducts =
  async () => {
    const response = await api.get(
      "/inventory/low-stock"
    );

    return response.data;
  };


// ==========================================
// GET ALL STOCK TRANSACTIONS
// ==========================================

export const getStockTransactions =
  async () => {
    const response = await api.get(
      "/inventory/transactions"
    );

    return response.data;
  };


// ==========================================
// GET PRODUCT STOCK HISTORY
// ==========================================

export const getProductStockHistory =
  async (productId) => {
    const response = await api.get(
      `/inventory/product/${productId}`
    );

    return response.data;
  };


// ==========================================
// ADJUST STOCK
//
// data example:
//
// {
//   productId: "...",
//   type: "purchase",
//   quantity: 20,
//   reference: "DELIVERY-001",
//   notes: "Stock received"
// }
// ==========================================

export const adjustStock = async (
  data
) => {
  const response = await api.post(
    "/inventory/adjust",
    data
  );

  return response.data;
};