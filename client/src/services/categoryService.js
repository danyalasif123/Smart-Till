import api from "./api";

// ==========================================
// GET ALL CATEGORIES
// GET /api/categories
// ==========================================

export const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};


// ==========================================
// GET CATEGORY BY ID
// GET /api/categories/:id
// ==========================================

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);

  return response.data;
};


// ==========================================
// CREATE CATEGORY
// POST /api/categories
// ==========================================

export const createCategory = async (data) => {
  const response = await api.post("/categories", data);

  return response.data;
};


// ==========================================
// UPDATE CATEGORY
// PUT /api/categories/:id
// ==========================================

export const updateCategory = async (id, data) => {
  const response = await api.put(`/categories/${id}`, data);

  return response.data;
};


// ==========================================
// UPDATE CATEGORY STATUS
// PATCH /api/categories/:id/status
// ==========================================

export const updateCategoryStatus = async (id, status) => {
  const response = await api.patch(
    `/categories/${id}/status`,
    {
      status,
    }
  );

  return response.data;
};


// ==========================================
// DELETE CATEGORY
// DELETE /api/categories/:id
// ==========================================

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);

  return response.data;
};