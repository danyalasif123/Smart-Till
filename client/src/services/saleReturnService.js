import api from "./api";

// ==========================================
// CREATE SALE RETURN
// ==========================================

export const createSaleReturn = async (
  data
) => {

  const response =
    await api.post(
      "/sale-returns",
      data
    );

  return response.data;

};

// ==========================================
// GET ALL RETURNS
// ==========================================

export const getSaleReturns =
  async () => {

    const response =
      await api.get(
        "/sale-returns"
      );

    return response.data;

};

// ==========================================
// GET SINGLE RETURN
// ==========================================

export const getSaleReturnById =
  async (id) => {

    const response =
      await api.get(
        `/sale-returns/${id}`
      );

    return response.data;

};