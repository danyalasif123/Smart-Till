import api from "./api";

// ==========================================
// GET ALL SUPPLIERS
// ==========================================

export const getSuppliers = async () => {
  const response = await api.get("/suppliers");

  return response.data;
};

// ==========================================
// GET SUPPLIER BY ID
// ==========================================

export const getSupplierById = async (id) => {
  const response = await api.get(
    `/suppliers/${id}`
  );

  return response.data;
};

// ==========================================
// CREATE SUPPLIER
// ==========================================

export const createSupplier = async (data) => {
  const response = await api.post(
    "/suppliers",
    data
  );

  return response.data;
};

// ==========================================
// UPDATE SUPPLIER
// ==========================================

export const updateSupplier = async (
  id,
  data
) => {
  const response = await api.put(
    `/suppliers/${id}`,
    data
  );

  return response.data;
};

// ==========================================
// UPDATE SUPPLIER STATUS
// ==========================================

export const updateSupplierStatus = async (
  id,
  status
) => {
  const response = await api.patch(
    `/suppliers/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};

// ==========================================
// DELETE SUPPLIER
// ==========================================

export const deleteSupplier = async (id) => {
  const response = await api.delete(
    `/suppliers/${id}`
  );

  return response.data;
};