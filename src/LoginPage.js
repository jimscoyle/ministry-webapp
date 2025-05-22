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
    <div className="container" style={{ maxWidth: 400, marginTop: 60 }}>
      <div className="card p-4 shadow">
        <h2 className="mb-3 text-center">
          {authMode === "login" ? "Login" : "Sign Up"}
        </h2>
        {error && (
          <div className="alert alert-danger mb-3">{error}</div>
        )}
        <form onSubmit={authMode === "login" ? handleLogin : handleSignUp}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {authMode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
        <button
          className="btn btn-link mt-3 w-100"
          onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
        >
          {authMode === "login" ? "Create an account" : "Back to Login"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
