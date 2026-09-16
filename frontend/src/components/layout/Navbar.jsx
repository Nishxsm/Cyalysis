import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/layout/Navbar.css";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      //always showat the very top
      if (currentScrollY <= 20) {
        setHidden(false);
      }
      // scrollin down
      else if (currentScrollY > lastScrollY) {
        setHidden(true);
      }
      // crollin up
      else if (currentScrollY < lastScrollY) {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`navbar ${hidden ? "navbar-hidden" : ""}`}>
      <div className="navbar-brand">
        <span>Cyalysis</span>
      </div>

      <nav className="navbar-links">
        <a href="#analysis"></a>
        <a href="#pricing"></a>
        <a href="#security"></a>

        <button
          className="navbar-button"
          onClick={() => navigate("/analysis")}
        >
          ANALYZE
        </button>
      </nav>
    </header>
  );
}