import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import RegisterBusiness from "../pages/auth/RegisterBusiness";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />

      <Route
        path="/register-business"
        element={<RegisterBusiness />}
      />

      {/* Protected Admin Route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;