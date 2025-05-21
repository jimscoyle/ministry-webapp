import React from "react";
import { Link } from "react-router-dom";
import logo from "./HCCB-logo.svg"; // Uncomment if you have a logo

function Header() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "16px",
      background: "#319795",
      color: "white",
    }}>
      {/* <img src={logo} alt="Church Logo" style={{ width: 40, height: 40, marginRight: 16 }} /> */}
      <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: 24, fontWeight: 700 }}>
        Hope Church Ministry
      </Link>
    </div>
  );
}

export default Header;
