import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
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

      <div className="logo">
        <h2>SmartTill</h2>
      </div>

      <nav className="nav-links">

        <NavLink to="/admin">Dashboard</NavLink>

        <NavLink to="/admin/sales">Sales</NavLink>

        <NavLink to="/admin/products">Products</NavLink>

        <NavLink to="/admin/categories">Categories</NavLink>

        <NavLink to="/admin/customers">Customers</NavLink>

        <NavLink to="/admin/suppliers">Suppliers</NavLink>

        <NavLink to="/admin/users">Users</NavLink>

        <NavLink to="/admin/reports">Reports</NavLink>

        <NavLink to="/admin/settings">Settings</NavLink>

      </nav>

      <div className="user-section">

        <span>{user?.name}</span>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;