import "./Navbar.css";
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">

      {/* TOP BAR */}

      <div className="navbar-top">

        <div className="logo">
          <h2>SmartTill</h2>
        </div>

        <div className="user-section">

          <div className="user-info">
            <span>{user?.name}</span>
            <small>{user?.role}</small>
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </div>

      {/* MENU */}

      <nav className="navbar-menu">

        <NavLink to="/admin">
          Dashboard
        </NavLink>

        <NavLink to="/admin/pos">
          POS
        </NavLink>

        <NavLink to="/admin/sales">
          Sales
        </NavLink>

        <NavLink to="/admin/sale-returns">
          Sale Returns
        </NavLink>

        <NavLink to="/admin/purchases">
          Purchases
        </NavLink>

        <NavLink to="/admin/purchase-returns">
          Purchase Returns
        </NavLink>

        <NavLink to="/admin/products">
          Products
        </NavLink>

        <NavLink to="/admin/categories">
          Categories
        </NavLink>

        <NavLink to="/admin/inventory">
          Inventory
        </NavLink>

        <NavLink to="/admin/customers">
          Customers
        </NavLink>

        <NavLink to="/admin/suppliers">
          Suppliers
        </NavLink>

        <NavLink to="/admin/users">
          Users
        </NavLink>

        <NavLink to="/admin/reports">
          Reports
        </NavLink>

        <NavLink to="/admin/settings">
          Settings
        </NavLink>

      </nav>

    </header>
  );
}

export default Navbar;