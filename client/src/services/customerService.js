import api from "./api";

// ==========================================
// GET ALL CUSTOMERS
// ==========================================

export const getCustomers = async () => {
  const response = await api.get("/customers");

  return response.data;
};


// ==========================================
// GET CUSTOMER BY ID
// ==========================================

export const getCustomerById = async (id) => {
  const response = await api.get(
    `/customers/${id}`
  );

  return response.data;
};


// ==========================================
// LOOKUP CUSTOMER BY CUSTOMER NUMBER
//
// Used by POS:
// CUST-A82F19C4
// ==========================================

export const getCustomerByNumber = async (
  customerNumber
) => {
  const response = await api.get(
    `/customers/number/${encodeURIComponent(
      customerNumber
    )}`
  );

  return response.data;
};


// ==========================================
// CREATE CUSTOMER
// ==========================================

export const createCustomer = async (data) => {
  const response = await api.post(
    "/customers",
    data
  );

  return response.data;
};


// ==========================================
// UPDATE CUSTOMER
// ==========================================

export const updateCustomer = async (
  id,
  data
) => {
  const response = await api.put(
    `/customers/${id}`,
    data
  );

  return response.data;
};


// ==========================================
// UPDATE CUSTOMER STATUS
// ==========================================

export const updateCustomerStatus = async (
  id,
  status
) => {
  const response = await api.patch(
    `/customers/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};


// ==========================================
// DELETE CUSTOMER
// ==========================================

export const deleteCustomer = async (id) => {
  const response = await api.delete(
    `/customers/${id}`
  );

  return response.data;
};