
import { useMemo } from "react";
import { Copy, LayoutDashboard } from "lucide-react";

import OverviewCard from "./OverviewCard";
import "../../styles/insights/OverviewSection.css";
import "../../styles/insights/OverviewCard.css";

function getPayload(result) {
  let payload = result ?? {};

  for (let i = 0; i < 3; i++) {
    const nested = payload?.result ?? payload?.data;

    if (!nested || typeof nested !== "object" || Array.isArray(nested)) {
      break;
    }

    payload = nested;
  }

  return payload;
}

function getChecks(payload) {
  const candidates = [
    payload?.results,
    payload?.checks,
    payload?.scan_results,
    payload?.check_results,
  ];

  return candidates.find(Array.isArray) ?? [];
}

function normalizeName(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .trim();
}

function findCheck(checks, names) {
  const expected = names.map(normalizeName);

  return (
    checks.find((check) =>
      expected.includes(
        normalizeName(
          check?.assessment?.canonical_name ??
            check?.name ??
            check?.check_name ??
            check?.title
        )
      )
    ) ??
    checks.find((check) => {
      const name = normalizeName(
        check?.name ?? check?.check_name ?? check?.title
      );

      return expected.some(
        (candidate) =>
          name === candidate || name.includes(candidate)
      );
    }) ??
    null
  );
}

function getCheckData(check) {
  return check?.data ?? {};
}

function getText(value) {
  if (value == null) return null;

  if (typeof value === "string") {
    const text = value.trim();

    if (
      !text ||
      /^(unavailable|unknown|n\/a|null)$/i.test(text)
    ) {
      return null;
    }

    return text;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const values = value.map(getText).filter(Boolean);
    return values.length ? values.join(", ") : null;
  }

  if (typeof value === "object") {
    for (const key of [
      "value",
      "name",
      "version",
      "ip",
      "address",
      "hostname",
      "provider",
      "organization",
      "org",
      "response_time_ms",
      "status_code",
    ]) {
      if (value[key] != null) {
        const text = getText(value[key]);
        if (text) return text;
      }
    }
  }

  return null;
}

function extractIPs(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map(getText).filter(Boolean))].join(", ") || null;
  }

  return getText(value);
}

function extractIssuer(issuer) {
  if (!Array.isArray(issuer)) {
    return getText(issuer);
  }

  const parts = [];

  function visit(value) {
    if (!Array.isArray(value)) return;

    if (
      value.length === 2 &&
      typeof value[0] === "string" &&
      typeof value[1] === "string"
    ) {
      const key = value[0];
      const label = {
        organizationName: "Organization",
        commonName: "Common Name",
        countryName: "Country",
      }[key];

      if (label && !parts.some((part) => part.key === key)) {
        parts.push({ key, label, value: value[1] });
      }

      return;
    }

    value.forEach(visit);
  }

  visit(issuer);

  if (!parts.length) return null;

  const organization = parts.find(
    (part) => part.key === "organizationName"
  );
  const commonName = parts.find(
    (part) => part.key === "commonName"
  );

  return (
    organization?.value ??
    commonName?.value ??
    parts[0]?.value ??
    null
  );
}

function parseDate(value) {
  if (!value) return null;

  const text = String(value).trim();

  // OpenSSL-style certificate dates, e.g.
  // "Dec  4 23:29:33 2026 GMT"
  const opensslMatch = text.match(
    /^([A-Za-z]{3})\s+(\d{1,2})\s+(\d{2}:\d{2}:\d{2})\s+(\d{4})\s+GMT$/
  );

  if (opensslMatch) {
    const [, month, day, time, year] = opensslMatch;
    const timestamp = Date.parse(
      `${month} ${day}, ${year} ${time} GMT`
    );

    return Number.isNaN(timestamp) ? null : timestamp;
  }

  const timestamp = Date.parse(text);

  return Number.isNaN(timestamp) ? null : timestamp;
}

function formatDate(timestamp) {
  if (timestamp == null) return null;

  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function extractVersion(value, kind) {
  const text = getText(value);
  if (!text) return null;

  if (kind === "tls") {
    return text.match(/\bTLSv?1\.[0-3]\b/i)?.[0] ?? null;
  }

  return text.match(/\bHTTP\/[123](?:\.\d+)?\b/i)?.[0] ?? null;
}

export default function OverviewSection({ result }) {
  const payload = useMemo(() => getPayload(result), [result]);
  const checks = useMemo(() => getChecks(payload), [payload]);

  const info = useMemo(() => {
    const redirectCheck = findCheck(checks, [
      "Redirect Chain Analysis",
    ]);

    const statusCheck = findCheck(checks, [
      "HTTP Status Analysis",
    ]);

    const responseTimeCheck = findCheck(checks, [
      "Response Time Measurement",
    ]);

    const ipCheck = findCheck(checks, [
      "IP Resolution",
    ]);

    const cdnCheck = findCheck(checks, [
      "CDN Detection",
    ]);

    const tlsCheck = findCheck(checks, [
      "TLS Version",
    ]);

    const certificateExpiryCheck = findCheck(checks, [
      "Certificate Expiration",
    ]);

    const certificateChainCheck = findCheck(checks, [
      "Certificate Chain",
      "TLS Chain",
    ]);

    const redirectData = getCheckData(redirectCheck);
    const statusData = getCheckData(statusCheck);
    const responseTimeData = getCheckData(responseTimeCheck);
    const ipData = getCheckData(ipCheck);
    const cdnData = getCheckData(cdnCheck);
    const tlsData = getCheckData(tlsCheck);
    const expiryData = getCheckData(certificateExpiryCheck);
    const chainData = getCheckData(certificateChainCheck);

    const target =
      getText(payload?.target_url) ??
      getText(payload?.target) ??
      getText(payload?.url) ??
      "Target unavailable";

    const finalUrl =
      getText(redirectData.final_url) ??
      target;

    const status =
      Number(statusData.status_code) ||
      Number(redirectData.status_code) ||
      null;

    const responseTimeValue = Number(
      responseTimeData.response_time_ms
    );

    const responseTime =
      Number.isFinite(responseTimeValue) &&
      responseTimeData.response_time_ms != null
        ? responseTimeValue
        : null;

    const redirectList = redirectData.redirects;
    const redirects = Array.isArray(redirectList)
      ? redirectList.length
      : null;

    const serverIp = extractIPs(ipData.ips);

    const cdnEntries = cdnData.cdn;
    const cdn = Array.isArray(cdnEntries)
      ? cdnEntries
          .map((entry) => getText(entry?.name))
          .filter(Boolean)
          .filter((name, index, all) => all.indexOf(name) === index)
          .join(", ") || null
      : getText(cdnEntries);

    const tlsVersion = extractVersion(tlsData.version, "tls");

    const expiryTimestamp = parseDate(expiryData.not_after);
    const certExpiryDate = formatDate(expiryTimestamp);

    const certExpiry =
      expiryTimestamp !== null
        ? Math.ceil(
            (expiryTimestamp - Date.now()) / (1000 * 60 * 60 * 24)
          )
        : null;

    const certIssuer = extractIssuer(chainData.issuer);

    return {
      target,
      finalUrl,
      status,
      statusText:
        status !== null
          ? status >= 200 && status < 300
            ? "Successful response"
            : "HTTP response received"
          : null,
      // This scanner JSON does not currently contain a negotiated
      // HTTP version, ASN lookup, or server geolocation result.
      httpVersion: null,
      responseTime,
      redirects,
      serverIp,
      provider: null,
      cdn,
      location: null,
      tlsVersion,
      certExpiry,
      certExpiryDate,
      certIssuer,
    };
  }, [payload, checks]);

  async function copyValue(value) {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(String(value));
    } catch {
      // Clipboard access may be unavailable.
    }
  }

  const expiryProgress =
    info.certExpiry !== null
      ? Math.max(0, Math.min(100, (info.certExpiry / 90) * 100))
      : null;

  let finalHostname = info.target;

  try {
    finalHostname = new URL(info.finalUrl).hostname;
  } catch {
    finalHostname = info.finalUrl;
  }

  return (
    <section className="overview-section" id="overview">
      <div className="overview-heading">
        <span className="overview-heading-icon">
          <LayoutDashboard size={20} />
        </span>

        <div>
          <h1>Overview</h1>
          <p>Connection, hosting, and certificate summary at a glance.</p>
        </div>
      </div>

      <div className="overview-grid">
        <article className="overview-card">
          <span className="overview-card-label">FINAL URL</span>

          <div className="overview-card-copy-row">
            <strong className="overview-card-mono">
              {finalHostname}
            </strong>

            <button
              type="button"
              className="overview-copy-button"
              onClick={() => copyValue(info.finalUrl)}
              aria-label="Copy target URL"
              title="Copy target URL"
            >
              <Copy size={15} />
            </button>
          </div>

          <span className="overview-card-secondary overview-url-secondary">
            {info.finalUrl}
          </span>
        </article>

        <OverviewCard
          label="HTTP STATUS"
          value={info.status}
          secondary={info.statusText}
          variant="overview-card-status"
        />

        <OverviewCard
          label="HTTP VERSION"
          value={info.httpVersion}
          variant="overview-card-protocol"
        />

        <OverviewCard
          label="RESPONSE TIME"
          value={
            info.responseTime !== null
              ? `${Number(info.responseTime.toFixed(2))} ms`
              : null
          }
          variant="overview-card-response"
        />

        <OverviewCard
          label="REDIRECTS"
          value={info.redirects}
          secondary={
            info.redirects !== null ? "redirects followed" : null
          }
        />

        <OverviewCard
          label="SERVER IP"
          value={info.serverIp}
          secondary={
            info.serverIp?.includes(",")
              ? "Multiple addresses resolved"
              : info.serverIp
                ? "Resolved address"
                : null
          }
          variant="overview-card-mono-value"
        />

        <OverviewCard
          label="ASN · PROVIDER"
          value={info.provider}
          variant="overview-card-provider"
        />

        <OverviewCard
          label="CDN"
          value={info.cdn}
          variant="overview-card-protocol"
        />

        <OverviewCard
          label="LOCATION"
          value={info.location}
        />

        <OverviewCard
          label="TLS VERSION"
          value={info.tlsVersion}
          variant="overview-card-protocol"
        />

        <OverviewCard
          label="CERT EXPIRY"
          value={
            info.certExpiry !== null
              ? info.certExpiry >= 0
                ? `${info.certExpiry} days`
                : "Expired"
              : null
          }
          secondary={info.certExpiryDate}
          progress={expiryProgress}
          variant="overview-card-response"
        />

        <OverviewCard
          label="CERT ISSUER"
          value={info.certIssuer}
        />
      </div>
    </section>
  );
}
