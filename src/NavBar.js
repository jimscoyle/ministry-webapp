import React from "react";
import { Link } from "react-router-dom";

function NavBar({ user, role, userName, handleLogout }) {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light mb-4 px-3">
      <Link className="navbar-brand" to="/">Home</Link>
      <div className="navbar-nav me-auto">
        {user && (
          <Link className="nav-link" to="/prayer-requests">Prayer Requests</Link>
        )}
        {(role === "pastor" || role === "admin") && user && (
          <Link className="nav-link" to="/admin">Admin</Link>
        )}
      </div>
      <div className="d-flex align-items-center ms-auto">
        {user ? (
          <>
            <span className="me-2">Hi{userName ? `, ${userName}` : ""}!</span>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm ms-2">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
