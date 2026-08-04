import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import RegisterBusiness from "../pages/auth/RegisterBusiness";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import Suppliers from "../pages/admin/Suppliers";
import Customers from "../pages/admin/Customers";
import POS from "../pages/pos/POS";
import Sales from "../pages/admin/Sales";
import Inventory from "../pages/admin/Inventory";
import Purchases from "../pages/admin/Purchases";
import Reports from "../pages/admin/Reports";
import SaleReturns from "../pages/admin/SaleReturns";
import PurchaseReturn from "../pages/admin/PurchaseReturns"
function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          Public Routes
      ========================= */}

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register-business"
        element={<RegisterBusiness />}
      />

      {/* =========================
          Admin Dashboard
      ========================= */}

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

      {/* =========================
          Users
      ========================= */}

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

      {/* =========================
          Categories
      ========================= */}

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <Categories />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/products"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <Products />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/suppliers"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <Suppliers />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/customers"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <Customers />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/pos"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <POS />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/sales"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <Sales />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
      path="/admin/sale-returns"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <SaleReturns/>
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/inventory"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <Inventory />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/purchases"
  element={<ProtectedRoute role="admin">
      <AdminLayout>
        <Purchases />
      </AdminLayout>
    </ProtectedRoute>}
/>
<Route
  path="/admin/purchases"
  element={<ProtectedRoute role="admin">
      <AdminLayout>
        <Purchases />
      </AdminLayout>
    </ProtectedRoute>}
/>

<Route
  path="/admin/purchase-returns"
  element={<ProtectedRoute role="admin">
      <AdminLayout>
        <PurchaseReturn />
      </AdminLayout>
    </ProtectedRoute>}
/>
    </Routes>
    
  );
}

export default AppRoutes;