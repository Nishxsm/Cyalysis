import "../../styles/landing/HowItWorks.css";

function ChainIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M25 39l-5 5a10 10 0 01-14-14l8-8a10 10 0 0114 0"
      />
      <path
        d="M39 25l5-5a10 10 0 0114 14l-8 8a10 10 0 01-14 0"
      />
      <path d="M23 41l18-18" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M36 4L17 35h14l-4 25 20-33H33z" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M17 5h23l12 12v42H17z" />
      <path d="M40 5v13h12" />
      <path d="M25 31h18M25 39h18M25 47h13" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-it-works-header">
        <div className="how-it-works-eyebrow">HOW IT WORKS</div>

        <h2>
          Three steps to a full
          <br />
          security assessment.
        </h2>
      </div>

      <div className="how-it-works-grid">
        <div className="how-step">
          <div className="how-step-number">01</div>

          <div className="how-step-icon">
            <ChainIcon />
          </div>

          <h3>Enter a URL</h3>

          <p>
            Enter the website you want to analyze. No account or
            setup is required to begin a non-destructive assessment.
          </p>
        </div>

        <div className="how-arrow">→</div>

        <div className="how-step">
          <div className="how-step-number">02</div>

          <div className="how-step-icon">
            <ScanIcon />
          </div>

          <h3>We analyze 56 checks</h3>

          <p>
            CYALYSIS evaluates DNS, HTTP, TLS, security headers,
            cookies, CORS, technologies, information disclosure,
            and HTTP methods.
          </p>
        </div>

        <div className="how-arrow">→</div>

        <div className="how-step">
          <div className="how-step-number">03</div>

          <div className="how-step-icon">
            <ReportIcon />
          </div>

          <h3>Understand the results</h3>

          <p>
            Review findings with severity, evidence, explanations,
            remediation guidance, and an overall security assessment
            you can track over time.
          </p>
        </div>
      </div>
    </section>
  );
}

