import { useState } from "react";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [menu, setMenu] = useState(false);

  const closeMenu = () => setMenu(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">⌂</span>

          <span>StayNest</span>
        </Link>

        <nav className={`nav-links ${menu ? "nav-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/search" onClick={closeMenu}>
            Explore
          </NavLink>

          <NavLink to="/wishlist" onClick={closeMenu}>
            Wishlist
          </NavLink>

          <NavLink to="/host" onClick={closeMenu}>
            Become a Host
          </NavLink>

          {user && (
            <NavLink to="/bookings" onClick={closeMenu}>
              My Bookings
            </NavLink>
          )}
        </nav>

        <div className="nav-right">
          {user ? (
            <div className="desktop-user">
              <span className="user-chip">👤 {user.name || user.email}</span>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link className="login-btn" to="/login">
              Login
            </Link>
          )}

          <button className="menu-btn" onClick={() => setMenu(!menu)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;