import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import RegisterBusiness from "../pages/auth/RegisterBusiness";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/Users/Users";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />

      <Route
        path="/register-business"
        element={<RegisterBusiness />}
      />

      {/* Dashboard */}
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

      {/* Users */}
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <Users />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;