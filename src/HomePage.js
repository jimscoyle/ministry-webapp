import React from "react";
import { Link } from "react-router-dom";

function HomePage({ user, userName }) {
  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h1>Welcome to Jim’s Ministry App</h1>
      <p>
        This is a place for our church family to share prayer requests, view rotas, and for our pastors to coordinate care.
      </p>
      {!user ? (
        <div>
          <Link to="/login">
            <button style={{ fontSize: 18, padding: "8px 24px" }}>
              Log In / Sign Up
            </button>
          </Link>
        </div>
      ) : (
        <div>
          <h3>Welcome back, {userName}!</h3>
          <Link to="/prayer-requests">View Prayer Requests</Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;
