
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/layout/Login.css";

const API_URL = "/api/auth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to create your account."
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
    <main className="login-page signup-page">
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
            CREATE YOUR WORKSPACE
          </p>

          <h1>
            Know your
            <br />
            <span>attack surface.</span>
          </h1>

          <p className="login-description">
            Create your account to run authorized security
            assessments, keep track of previous scans, and
            review your findings in one place.
          </p>

          <div className="login-meta">
            <span>01 / REGISTRATION</span>
            <span>CYALYSIS SYSTEMS</span>
          </div>
        </section>

        <section className="login-card signup-card">
          <div className="login-card-heading">
            <p className="login-card-label">NEW ACCOUNT</p>
            <h2>Get started.</h2>
            <p>Create an account to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="signup-name">FULL NAME</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <label htmlFor="signup-email">EMAIL ADDRESS</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={255}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <div className="login-password-heading">
              <label htmlFor="signup-password">PASSWORD</label>
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
              id="signup-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <div className="login-password-heading">
              <label htmlFor="signup-confirm-password">
                CONFIRM PASSWORD
              </label>
              <button
                type="button"
                className="login-toggle"
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
              >
                {showConfirmPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
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
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="login-divider">
            <span />
            <span>ALREADY REGISTERED?</span>
            <span />
          </div>

          <p className="login-signup">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
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
