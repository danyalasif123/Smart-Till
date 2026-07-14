import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/login";
import RegisterBusiness from "../pages/auth/RegisterBusiness";

import ProtectedRoute from "./ProtectedRoute";

function AdminDashboard() {
  return <h1>Admin Dashboard</h1>;
}

function ManagerDashboard() {
  return <h1>Manager Dashboard</h1>;
}

function CashierDashboard() {
  return <h1>Cashier Dashboard</h1>;
}

function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register-business"
        element={<RegisterBusiness />}
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute role="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cashier"
        element={
          <ProtectedRoute role="cashier">
            <CashierDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;