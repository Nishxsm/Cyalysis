
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

      if (currentScrollY <= 20) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`navbar ${hidden ? "navbar-hidden" : ""}`}>
      <div
        className="navbar-brand"
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            navigate("/");
          }
        }}
      >
        <span>Cyalysis</span>
      </div>

      <nav className="navbar-links">
        <button
          className="navbar-button"
          onClick={() => navigate("/login")}
        >
          LOGIN
        </button>
      </nav>
    </header>
  );
}
