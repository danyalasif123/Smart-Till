import "./Navbar.css";

import { NavLink } from "react-router-dom";

import { navItems } from "./navItems";

import DropdownMenu from "./DropdownMenu";

import { useAuth } from "../../context/AuthContext";

function Navbar() {

    const { user, logoutUser } = useAuth();

    return (

        <header className="navbar">

            <div className="navbar-top">

                <h2>
                    SmartTill
                </h2>

                <input
                    placeholder="Search..."
                    className="navbar-search"
                />

                <div className="navbar-user">

                    <span>

                        {user?.name}

                    </span>

                    <button
                        onClick={logoutUser}
                    >
                        Logout
                    </button>

                </div>

            </div>

            <div className="navbar-bottom">

                {

                    navItems.map((item) => {

                        if (item.children) {

                            return (

                                <DropdownMenu

                                    key={item.label}

                                    title={item.label}

                                    icon={item.icon}

                                    children={item.children}

                                />

                            );

                        }

                        const Icon = item.icon;

                        return (

                            <NavLink

                                key={item.to}

                                to={item.to}

                                className="nav-link"

                            >

                                <Icon />

                                <span>

                                    {item.label}

                                </span>

                            </NavLink>

                        );

                    })

                }

            </div>

        </header>

    );

}

export default Navbar;