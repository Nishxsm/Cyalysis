
import { useMemo } from "react";
import { Copy, LayoutDashboard } from "lucide-react";
import OverviewCard from "./OverviewCard";
import "../../styles/insights/OverviewSection.css";
import "../../styles/insights/OverviewCard.css";

function getPayload(result) {
  return result?.result ?? result?.data ?? result ?? {};
}

function getChecks(payload) {
  const checks =
    payload?.checks ??
    payload?.results ??
    payload?.scan_results ??
    payload?.check_results ??
    [];

  return Array.isArray(checks) ? checks : [];
}

function getCheckName(check) {
  return String(
    check?.name ??
    check?.check_name ??
    check?.title ??
    check?.check ??
    ""
  )
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

function getCheckText(check) {
  return [
    check?.message,
    check?.description,
    check?.evidence,
    check?.output,
    check?.details,
    check?.value,
  ]
    .filter((value) => value != null)
    .map((value) =>
      typeof value === "object" ? JSON.stringify(value) : String(value)
    )
    .join(" ");
}

function findCheck(checks, keywords) {
  return checks.find((check) => {
    const name = getCheckName(check);
    return keywords.some((keyword) => name.includes(keyword));
  });
}

function getRawValue(payload, checks, fields, keywords = []) {
  for (const field of fields) {
    const value = payload?.[field];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  const check = findCheck(checks, keywords);
  if (!check) return null;

  const candidates = [
    check.value,
    check.result_value,
    check.detected,
    check.version,
    check.ip,
    check.response_time_ms,
    check.status_code,
  ];

  for (const value of candidates) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return getCheckText(check) || null;
}

function getText(value) {
  if (value == null || value === "") return null;

  if (typeof value === "object") {
    const preferred =
      value.value ??
      value.name ??
      value.version ??
      value.ip ??
      value.address;

    return preferred != null ? String(preferred) : null;
  }

  return String(value).trim();
}

function extractStatus(value) {
  if (value == null) return null;

  const text = String(value);

  const match = text.match(
    /\b(?:HTTP\s+(?:status(?:\s+code)?\s*)?(?:returned\s*)?|status(?:\s+code)?\s*[:=]?\s*)([1-5]\d{2})\b/i
  );

  if (match) return Number(match[1]);

  const exact = text.trim().match(/^[1-5]\d{2}$/);
  return exact ? Number(exact[0]) : null;
}

function extractTime(value) {
  if (value == null) return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    return { value };
  }

  const text = String(value);

  const match = text.match(
    /(?:response(?:\s+received)?(?:\s+in)?|response\s+time)\s*[:=]?\s*([\d.]+)\s*(ms|milliseconds?|s|seconds?)\b/i
  );

  if (match) {
    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();

    if (!Number.isFinite(amount)) return null;

    return {
      value: unit.startsWith("s") ? amount * 1000 : amount,
    };
  }

  const exact = text.trim().match(/^([\d.]+)\s*(ms|milliseconds?)$/i);

  if (exact && Number.isFinite(Number(exact[1]))) {
    return { value: Number(exact[1]) };
  }

  return null;
}

function extractRedirects(value) {
  if (value == null) return null;

  const text = String(value);

  const match = text.match(
    /(?:detected\s+)?(\d+)\s+redirect(?:s|\(s\))?/i
  );

  if (match) return Number(match[1]);

  const exact = text.trim().match(/^\d+$/);
  return exact ? Number(exact[0]) : null;
}

function extractIPs(value) {
  if (value == null) return null;

  if (Array.isArray(value)) {
    return value.map(getText).filter(Boolean).join(", ") || null;
  }

  const text = String(value);

  const labelled = text.match(
    /(?:resolved\s+ip(?:\s+addresses)?|server\s+ip(?:\s+addresses)?)\s*[:=]\s*([\s\S]+)/i
  );

  const candidate = labelled ? labelled[1] : text;

  const ipv4 = candidate.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g);

  if (ipv4?.length) {
    return [...new Set(ipv4)].join(", ");
  }

  const exact = candidate.trim();

  if (exact.includes(":") && /^[0-9a-f:.]+$/i.test(exact)) {
    return exact;
  }

  return null;
}

function extractVersion(value, kind) {
  if (value == null) return null;

  const text = String(value);

  if (kind === "tls") {
    return text.match(/\bTLSv?[\s-]?1\.[0-3]\b/i)?.[0] ?? null;
  }

  if (kind === "http") {
    return text.match(/\bHTTP\/[123](?:\.\d+)?\b/i)?.[0] ?? null;
  }

  return null;
}

function formatDate(value) {
  if (!value) return null;

  const timestamp = Date.parse(String(value));

  if (Number.isNaN(timestamp)) return String(value);

  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OverviewSection({ result }) {
  const payload = useMemo(() => getPayload(result), [result]);
  const checks = useMemo(() => getChecks(payload), [payload]);

  const info = useMemo(() => {
    const target =
      getText(payload.target_url) ??
      getText(payload.target) ??
      getText(payload.url) ??
      "Target unavailable";

    // Read final URL only from explicit URL fields or a specifically named check.
    const finalUrl = getText(
      getRawValue(
        payload,
        checks,
        ["final_url", "finalUrl", "resolved_url", "final_uri"],
        ["final url"]
      )
    );

    const statusRaw = getRawValue(
      payload,
      checks,
      ["http_status", "status_code", "statusCode"],
      ["http status", "http response"]
    );

    const versionRaw = getRawValue(
      payload,
      checks,
      ["http_version", "httpVersion", "protocol"],
      ["http version", "http protocol"]
    );

    const timeRaw = getRawValue(
      payload,
      checks,
      ["response_time_ms", "response_time", "responseTime"],
      ["response time"]
    );

    const redirectsRaw = getRawValue(
      payload,
      checks,
      ["redirect_count", "redirects_count", "redirectCount"],
      ["redirect chain", "redirect count"]
    );

    const ipRaw = getRawValue(
      payload,
      checks,
      ["server_ip", "ip_address", "resolved_ip", "ip"],
      ["ip resolution", "server ip"]
    );

    const providerRaw = getRawValue(
      payload,
      checks,
      ["asn_provider", "provider", "hosting_provider", "asn_org"],
      ["asn provider", "hosting provider"]
    );

    const cdnRaw = getRawValue(
      payload,
      checks,
      ["cdn", "cdn_provider"],
      ["cdn detection", "cdn provider"]
    );

    const locationRaw = getRawValue(
      payload,
      checks,
      ["server_location", "location", "geo_location"],
      ["server location", "geolocation"]
    );

    const tlsRaw = getRawValue(
      payload,
      checks,
      ["tls_version", "tlsVersion", "protocol_version"],
      ["tls version", "ssl version"]
    );

    const expiryRaw = getRawValue(
      payload,
      checks,
      ["certificate_days_remaining", "cert_days_remaining"],
      ["certificate expiration", "certificate expiry"]
    );

    const expiryDateRaw = getRawValue(
      payload,
      checks,
      ["certificate_expiry", "cert_expiry", "expires_at"],
      ["certificate expiration date", "certificate expiry date"]
    );

    const issuerRaw = getRawValue(
      payload,
      checks,
      ["certificate_issuer", "cert_issuer", "issuer"],
      ["certificate issuer"]
    );

    const status = extractStatus(statusRaw);
    const time = extractTime(timeRaw);
    const redirects = extractRedirects(redirectsRaw);
    const ips = extractIPs(ipRaw);
    const httpVersion = extractVersion(versionRaw, "http");
    const tlsVersion = extractVersion(tlsRaw, "tls");

    const cdnText = getText(cdnRaw);
    const cdn = cdnText
      ? /no supported cdn|not detected|none detected/i.test(cdnText)
        ? "Not detected"
        : cdnText
      : null;

    const expiryText = getText(expiryRaw);
    const expiryMatch = expiryText?.match(
      /^\s*(\d+(?:\.\d+)?)\s*(?:days?)?\s*$/i
    );

    const expiryNumber = expiryMatch
      ? Number(expiryMatch[1])
      : null;

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
      httpVersion,
      responseTime: time?.value ?? null,
      redirects,
      serverIp: ips,
      provider: getText(providerRaw),
      cdn,
      location: getText(locationRaw),
      tlsVersion,
      certExpiry: expiryNumber,
      certExpiryDate: formatDate(expiryDateRaw),
      certIssuer: getText(issuerRaw),
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

  if (info.finalUrl) {
    try {
      finalHostname = new URL(info.finalUrl).hostname;
    } catch {
      finalHostname = info.finalUrl;
    }
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
        <article className="overview-card overview-card-wide">
          <span className="overview-card-label">FINAL URL</span>

          <div className="overview-card-copy-row">
            <strong className="overview-card-mono">
              {finalHostname}
            </strong>

            <button
              type="button"
              className="overview-copy-button"
              onClick={() => copyValue(info.finalUrl ?? info.target)}
              aria-label="Copy target URL"
              title="Copy target URL"
            >
              <Copy size={15} />
            </button>
          </div>

          <span className="overview-card-secondary overview-url-secondary">
            {info.finalUrl ?? info.target}
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
          secondary={info.redirects !== null ? "redirects followed" : null}
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
              ? `${info.certExpiry} days`
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
