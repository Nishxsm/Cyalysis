import "../../styles/landing/SecurityCTA.css";

export default function SecurityCTA() {
  return (
    <section className="security-cta">
      <div className="security-cta-glow" />

      <div className="security-cta-content">
        <h2>
          Stay ahead of
          <br />
          every <span>vulnerability</span>
        </h2>

        <div className="security-cta-actions">
          <button className="security-cta-primary">
            Start Analysis
          </button>

          <button className="security-cta-secondary">
            View Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

