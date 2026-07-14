import "./Topbar.css";
import { FaBars, FaBell, FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Topbar() {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <FaBars className="menu-icon" />

        <h2>SmartTill</h2>
      </div>

      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      <div className="topbar-right">
        <FaBell className="icon" />

        <div className="profile">
          <span>{user?.name}</span>
          <small>{user?.role}</small>
        </div>
      </div>
    </header>
  );
}

export default Topbar;