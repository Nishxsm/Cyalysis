import { useEffect, useState } from "react";
import "../../styles/layout/Navbar.css";

function Navbar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at the very top
      if (currentScrollY <= 20) {
        setHidden(false);
      }
      // Scrolling down
      else if (currentScrollY > lastScrollY) {
        setHidden(true);
      }
      // Scrolling up
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

        <button className="navbar-button">
          ANALYZE
        </button>
      </nav>
    </header>
  );
}

export default Navbar;