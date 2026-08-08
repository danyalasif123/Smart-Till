import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { navItems } from "./navItems";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
const Navbar=({})=> {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
const { logoutUser } = useAuth();

  const navRef = useRef(null);
  const location = useLocation();

  const isChildActive = (children = []) =>
    children.some(({ to }) => location.pathname === to);

  function toggleDropdown(label) {
    setOpenDropdown((current) =>
      current === label ? null : label
    );
  }


const handleLogout = () => {
  logoutUser();
};
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="admin-navbar" ref={navRef}>
      <div className="navbar-container">
        <NavLink to="/admin" className="navbar-brand">
          Admin
        </NavLink>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label={
            mobileOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <nav
          className={`navbar-menu ${
            mobileOpen ? "navbar-menu-open" : ""
          }`}
          aria-label="Admin navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = Boolean(item.children?.length);
            const dropdownOpen = openDropdown === item.label;
            const childActive = isChildActive(item.children);

            if (!hasChildren) {
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    `navbar-link ${
                      isActive ? "navbar-link-active" : ""
                    }`
                  }
                >
                  <Icon className="navbar-icon" />
                  <span>{item.label}</span>
                </NavLink>
              );
            }

            return (
              <div
                key={item.label}
                className={`navbar-dropdown ${
                  dropdownOpen ? "navbar-dropdown-open" : ""
                }`}
              >
                <button
                  type="button"
                  className={`navbar-link navbar-dropdown-button ${
                    childActive ? "navbar-link-active" : ""
                  }`}
                  aria-expanded={dropdownOpen}
                  onClick={() => toggleDropdown(item.label)}
                >
                  <Icon className="navbar-icon" />
                  <span>{item.label}</span>
                  <FiChevronDown className="dropdown-chevron" />
                </button>

                <div className="dropdown-menu">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `dropdown-link ${
                          isActive
                            ? "dropdown-link-active"
                            : ""
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
export default Navbar;
