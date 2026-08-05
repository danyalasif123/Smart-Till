import { NavLink } from "react-router-dom";
import "./DropdownMenu.css";

function DropdownMenu({ title, icon: Icon, children }) {

  return (

    <div className="dropdown">

      <button className="dropdown-btn">

        <Icon />

        <span>{title}</span>

      </button>

      <div className="dropdown-menu">

        {children.map((item) => (

          <NavLink
            key={item.to}
            to={item.to}
            className="dropdown-item"
          >
            {item.label}
          </NavLink>

        ))}

      </div>

    </div>

  );

}

export default DropdownMenu;