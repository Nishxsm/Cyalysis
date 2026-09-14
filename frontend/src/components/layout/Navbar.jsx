import { useEffect, useState } from "react";
import "../../styles/layout/Navbar.css";

function Navbar() {
  const [hidden, setHidden] = useState(false);

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

        <button className="navbar-button">
          ANALYZE
        </button>
      </nav>
    </header>
  );
}

export default Navbar;