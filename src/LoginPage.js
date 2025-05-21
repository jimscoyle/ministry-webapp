import React from "react";

function LoginPage({
  email,
  setEmail,
  password,
  setPassword,
  authMode,
  setAuthMode,
  handleLogin,
  handleSignUp,
  error,
}) {
  return (
    <div style={{ maxWidth: 350, margin: "auto" }}>
      <h2>{authMode === "login" ? "Login" : "Sign Up"}</h2>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <form onSubmit={authMode === "login" ? handleLogin : handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: 8, width: "100%" }}
        />
        <button type="submit" style={{ width: "100%" }}>
          {authMode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
      <button
        style={{ marginTop: 16, width: "100%" }}
        onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
      >
        {authMode === "login" ? "Create an account" : "Back to Login"}
      </button>
    </div>
  );
}

export default LoginPage;
