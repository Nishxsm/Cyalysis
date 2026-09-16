import "../../styles/layout/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">

        <div className="footer-brand">
          <div className="footer-logo">
            CYALYSIS
          </div>

          <p>
            A web-based security assessment and
            vulnerability analysis system.
          </p>
        </div>

        <nav className="footer-nav">
          <a href="#analysis">Analysis</a>
          <a href="#security">Security</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#about">About</a>
        </nav>

      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">

        <div className="footer-meta">
          <span>© 2026 CYALYSIS.</span>
          <span>Built for web security assessment.</span>
        </div>

        <span className="footer-credit">
          TYCS PROJECT · 2026
        </span>

      </div>
    </footer>
  );
}

