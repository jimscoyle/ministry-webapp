import React from "react";
import { Link } from "react-router-dom";
import logo from "./hccb-logo-new.png"; // Change to your file name if needed

function Header() {
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      padding: "16px 32px",
      background: "#3bb0da",//"#00796b",    // default teal, will explain changing this below
      color: "white",
      marginBottom: 0,
      minHeight: 70,
      boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
    }}>
      <img src={logo} alt="Church Logo" style={{ width: 48, height: 48, marginRight: 16 }} />
      <Link to="/" style={{
        color: "white",
        textDecoration: "none",
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 0.5
      }}>
        Hope Community Church Barlanark - App
      </Link>
    </header>
  );
}

export default Header;
