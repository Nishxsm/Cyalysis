import { useState } from "react";
import {
  ShieldCheck,
  Network,
  Globe,
  LockKeyhole,
  Cookie,
  Layers3,
} from "lucide-react";

import "../../styles/analysis/AnalysisInput.css";

const analysisCards = [
  {
    icon: ShieldCheck,
    title: "Security Headers",
    description:
      "CSP, HSTS, X-Content-Type-Options, clickjacking, Referrer Policy and Permissions Policy analysis.",
  },
  {
    icon: Network,
    title: "Reconnaissance",
    description:
      "Domain, IP, DNS records, hosting information and exposed network details gathered from the target.",
  },
  {
    icon: Globe,
    title: "HTTP & HTTPS",
    description:
      "HTTP status, HTTPS availability, redirects, response headers, server information and response behavior.",
  },
  {
    icon: LockKeyhole,
    title: "TLS Analysis",
    description:
      "Certificate validation, expiration, hostname verification, chain configuration, TLS versions and ciphers.",
  },
  {
    icon: Cookie,
    title: "Cookies & CORS",
    description:
      "Cookie security attributes and cross-origin policies including credentials, origins, methods and headers.",
  },
  {
    icon: Layers3,
    title: "Technology & Exposure",
    description:
      "Frameworks, CMS, libraries, CDN, server versions, metadata, debug information and exposed technologies.",
  },
];

const exampleTargets = [
  "youtube.com",
  "cloudflare.com",
  "github.com",
];

export default function AnalysisInput({ onStart }) {
  const [url, setUrl] = useState("");

  const handleAnalyze = () => {
    const target = url.trim();

    if (!target) {
      return;
    }

    onStart(target);
  };

  const handleExample = (target) => {
    setUrl(`https://${target}`);
  };

  return (
    <main className="analysis-page">
      <section className="analysis-hero">

        <div className="analysis-status">
          <span className="status-dot"></span>
          CONTROLLED WEB SECURITY ANALYSIS
        </div>

        <h1>
          Inspect any website
          <br />
          <span>down to its security surface.</span>
        </h1>

        <p className="analysis-description">
          Enter a website URL and CYALYSIS will analyze its exposed
          security surface — including DNS, HTTP, TLS, security headers,
          cookies, CORS, technologies and information disclosure.
        </p>

        <div className="analysis-input-wrapper">
          <span className="input-prefix">&gt;</span>

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAnalyze();
              }
            }}
            placeholder="https://example.com"
          />

          <button
            className="analysis-button"
            onClick={handleAnalyze}
          >
            Analyze
            <span>→</span>
          </button>
        </div>

        <div className="analysis-examples">
          <span>Try</span>

          {exampleTargets.map((target) => (
            <button
              key={target}
              onClick={() => handleExample(target)}
            >
              {target}
            </button>
          ))}
        </div>

      </section>

      <section className="analysis-capabilities">
        {analysisCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              className="analysis-card"
              key={card.title}
            >
              <div className="analysis-card-icon">
                <Icon />
              </div>

              <h2>{card.title}</h2>

              <p>{card.description}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}