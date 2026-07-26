import "./Navbar.css";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logoutUser } = useAuth();

  const navigate = useNavigate();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logoutUser();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <header className="navbar">

      {/* =====================================
          LOGO
      ===================================== */}

      <div className="logo">
        <h2>SmartTill</h2>
      </div>

      {/* =====================================
          NAVIGATION
      ===================================== */}

      <nav className="nav-links">

        {/* DASHBOARD */}

        <NavLink to="/admin">
          Dashboard
        </NavLink>


        {/* POS */}

        <NavLink to="/admin/pos">
          POS
        </NavLink>


        {/* SALES HISTORY */}

        <NavLink to="/admin/sales">
          Sales History
        </NavLink>


        {/* PRODUCTS */}

        <NavLink to="/admin/products">
          Products
        </NavLink>


        {/* CATEGORIES */}

        <NavLink to="/admin/categories">
          Categories
        </NavLink>


        {/* CUSTOMERS */}

        <NavLink to="/admin/customers">
          Customers
        </NavLink>


        {/* INVENTORY */}

        <NavLink to="/admin/inventory">
          Inventory
        </NavLink>


        {/* SUPPLIERS */}

        <NavLink to="/admin/suppliers">
          Suppliers
        </NavLink>


        {/* USERS */}

        <NavLink to="/admin/users">
          Users
        </NavLink>


        {/* REPORTS */}

        <NavLink to="/admin/reports">
          Reports
        </NavLink>


        {/* SETTINGS */}

        <NavLink to="/admin/settings">
          Settings
        </NavLink>

      </nav>

      {/* =====================================
          USER
      ===================================== */}

      <div className="user-section">

        {user?.name && (
          <span className="navbar-user-name">
            {user.name}
          </span>
        )}

        <button
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;