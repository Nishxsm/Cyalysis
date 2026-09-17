import { useEffect, useState } from "react";
import ScanConsole from "./ScanConsole";
import "../../styles/analysis/ScanProgress.css";

const scanChecks = [
  "URL Validation",
  "Domain Resolution",
  "IP Resolution",
  "DNS A Record",
  "DNS AAAA Record",
  "DNS CNAME Record",
  "DNS MX Record",
  "DNS NS Record",
  "DNS TXT Record",
  "HTTP Status Analysis",
  "HTTPS Availability",
  "HTTPS Enforcement",
  "Redirect Chain",
  "Response Headers",
  "Server Banner",
  "Response Time",
  "Content-Type",
  "Web Server Detection",
  "Framework Detection",
  "CMS Detection",
  "Library Detection",
  "CDN Detection",
  "CSP Analysis",
  "HSTS Analysis",
  "X-Content-Type Analysis",
  "Clickjacking Analysis",
  "Referrer Policy",
  "Permissions Policy",
  "Security Header Completeness",
  "Cookie Enumeration",
  "Cookie Security",
  "CORS Analysis",
  "TLS Certificate",
  "TLS Expiration",
  "TLS Hostname",
  "TLS Chain",
  "TLS Version",
  "Cipher Configuration",
  "Server Version Disclosure",
  "Technology Version Disclosure",
  "Debug Information",
  "Verbose Error Analysis",
  "Metadata Analysis",
  "HTTP Method Enumeration",
  "OPTIONS Analysis",
  "Method Restriction",
  "TRACE Analysis",
  "Unsupported Methods",
];

export default function ScanProgress({ target }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setCompleted(0);

    const interval = setInterval(() => {
      setCompleted((current) => {
        if (current >= scanChecks.length) {
          clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const currentCheck =
    completed < scanChecks.length
      ? scanChecks[completed]
      : "Analysis Complete";

  const progress = Math.round(
    (completed / scanChecks.length) * 100
  );

  return (
    <section className="scan-progress">

      <div className="scan-progress-header">

        <div className="scan-target">
          <span className="scan-label">TARGET</span>

          <span className="scan-target-url">
            {target || "example.com"}
          </span>
        </div>

        <div className="scan-counter">
          <span>{completed}</span>
          <span className="scan-counter-total">
            / {scanChecks.length}
          </span>
        </div>

      </div>


      <div className="scan-radar">
        <div className="radar-ring radar-ring-one"></div>
        <div className="radar-ring radar-ring-two"></div>
        <div className="radar-ring radar-ring-three"></div>

        <div className="radar-dot"></div>
      </div>


      <div className="scan-current">

        <div className="scan-current-label">
          RUNNING
        </div>

        <div className="scan-current-check">
          {currentCheck}
        </div>

        <div className="scan-progress-track">
          <div
            className="scan-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>


      <ScanConsole
        checks={scanChecks}
        completed={completed}
        currentCheck={currentCheck}
        target={target}
      />

    </section>
  );
}