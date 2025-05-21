import React from "react";
import { Link } from "react-router-dom";

function NavBar({ user, role, userName, handleLogout }) {
  return (
    <nav style={{ marginBottom: 16 }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/prayer-requests">Prayer Requests</Link>
      {role === "pastor" || role === "admin" ? (
        <>
          {" | "}
          <Link to="/admin">Admin</Link>
        </>
      ) : null}
      <span style={{ float: "right" }}>
        {user ? (
          <>
            Hi{userName ? `, ${userName}` : ""}!{" "}
            <button style={{ marginLeft: 8 }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ marginLeft: 8 }}>
            Login
          </Link>
        )}
      </span>
    </nav>
  );
}

export default NavBar;
