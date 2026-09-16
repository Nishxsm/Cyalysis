import { useNavigate } from "react-router-dom";
import "../../styles/landing/Hero.css";

export default function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="landing-hero">

      <div className="hero-video-wrapper">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/1.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero-video-overlay" />

      <div className="hero-bg-labels">
        <span className="label label-1">dns_lookup</span>
        <span className="label label-2">tls_analysis</span>
        <span className="label label-3">header_check</span>
        <span className="label label-4">cors_policy</span>
        <span className="label label-5">cookie_scan</span>
        <span className="label label-6">http_methods</span>
        <span className="label label-7">tech_detect</span>
        <span className="label label-8">recon_scan</span>
      </div>

      <div className="hero-content">

        <div className="hero-eyebrow">
          WEB SECURITY ANALYSIS&nbsp;&nbsp;·&nbsp;&nbsp;
          CONTROLLED SCANNING&nbsp;&nbsp;·&nbsp;&nbsp;
          REAL-TIME ASSESSMENT
        </div>

        <h1>
          See what your website
          <br />
          exposes to the internet.
        </h1>

        <p className="hero-description">
          CYALYSIS analyzes your website's security surface,
          identifies potential weaknesses, and helps you
          understand where your defenses can be improved.
        </p>

        <button
          className="hero-button"
          onClick={() => navigate("/analysis")}
        >
          Start Analysis
          <span>→</span>
        </button>

      </div>
    </section>
  );
}