
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/layout/Login.css";

const API_URL = "/api/auth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed. Please check your credentials."
        );
      }

      navigate("/analysis", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to CYALYSIS. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-grid" aria-hidden="true" />

      <button
        className="login-brand"
        onClick={() => navigate("/")}
        type="button"
      >
        Cyalysis<span>.</span>
      </button>

      <div className="login-layout">
        <section className="login-intro">
          <p className="login-eyebrow">
            <span className="login-status-dot" />
            SECURITY ANALYSIS PLATFORM
          </p>

          <h1>
            Your security.
            <br />
            <span>Your visibility.</span>
          </h1>

          <p className="login-description">
            Sign in to access your workspace, run security
            assessments, and review your previous scan results.
          </p>

          <div className="login-meta">
            <span>01 / AUTHENTICATION</span>
            <span>CYALYSIS SYSTEMS</span>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-heading">
            <p className="login-card-label">ACCOUNT ACCESS</p>
            <h2>Welcome back.</h2>
            <p>Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <div className="login-password-heading">
              <label htmlFor="password">PASSWORD</label>
              <button
                type="button"
                className="login-toggle"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="login-divider">
            <span />
            <span>NEW TO CYALYSIS?</span>
            <span />
          </div>

          <p className="login-signup">
            Don't have an account?{" "}
            <Link to="/signup">Create one</Link>
          </p>

          <p className="login-security-note">
            AUTHORIZED ACCESS ONLY
          </p>
        </section>
      </div>

      <footer className="login-footer">
        <span>CYALYSIS © 2026</span>
        <span>WEB-BASED SECURITY ASSESSMENT</span>
      </footer>
    </main>
  );
}
