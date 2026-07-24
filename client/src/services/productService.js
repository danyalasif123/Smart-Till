import api from "./api";

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getProducts = async () => {
  const response = await api.get("/products");

  return response.data;
};

// ==========================================
// GET PRODUCT BY ID
// ==========================================

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

// ==========================================
// CREATE PRODUCT
// ==========================================

export const createProduct = async (data) => {
  const response = await api.post("/products", data);

  return response.data;
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

export const updateProduct = async (id, data) => {
  const response = await api.put(
    `/products/${id}`,
    data
  );

  return response.data;
};

// ==========================================
// UPDATE PRODUCT STATUS
// ==========================================

export const updateProductStatus = async (
  id,
  status
) => {
  const response = await api.patch(
    `/products/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};

// ==========================================
// DELETE PRODUCT
// ==========================================

export const deleteProduct = async (id) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};