
import { useMemo } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Cookie,
  Eye,
} from "lucide-react";
import "../../styles/insights/ScoredSummary.css";

const CATEGORIES = [
  {
    name: "Security Headers",
    description: "Browser security policies and protective response headers.",
    icon: ShieldCheck,
    checks: [
      "csp analysis",
      "hsts analysis",
      "x-content-type analysis",
      "clickjacking protection analysis",
      "clickjacking analysis",
      "referrer policy analysis",
      "permissions policy analysis",
      "security header completeness",
    ],
  },
  {
    name: "Transport Security",
    description: "HTTPS configuration, certificates, and TLS settings.",
    icon: LockKeyhole,
    checks: [
      "https availability check",
      "https availability",
      "https enforcement check",
      "https enforcement",
      "certificate validation",
      "certificate expiration",
      "hostname verification",
      "certificate chain",
      "tls version",
      "cipher configuration",
    ],
  },
  {
    name: "Cookie Security",
    description: "Cookie flags, scope, and expiration configuration.",
    icon: Cookie,
    checks: [
      "cookie enumeration",
      "secure flag analysis",
      "httponly flag analysis",
      "cookie security",
      "samesite analysis",
      "cookie scope analysis",
      "cookie expiration analysis",
    ],
  },
  {
    name: "Information Exposure",
    description: "Version disclosure, verbose errors, and exposed metadata.",
    icon: Eye,
    checks: [
      "server banner detection",
      "server banner",
      "server version disclosure",
      "technology version disclosure",
      "debug information detection",
      "debug information",
      "verbose error analysis",
      "metadata disclosure analysis",
      "metadata analysis",
    ],
  },
];

function getPayload(result) {
  return result?.result ?? result?.data ?? result ?? {};
}

function getCheckName(check) {
  return String(
    check?.assessment?.canonical_name ??
      check?.name ??
      check?.check_name ??
      check?.title ??
      ""
  )
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .trim();
}

function getState(check) {
  const state = check?.assessment?.state;

  if (state) return state;

  const status = String(check?.status ?? "").toLowerCase();

  if (status === "passed") return "passed";
  if (status === "failed") return "unable_to_assess";

  return "unknown";
}

function calculateCategory(checks, category) {
  const relevantChecks = checks.filter((check) => {
    const name = getCheckName(check);
    return category.checks.some(
      (keyword) => name === keyword || name.includes(keyword)
    );
  });

  // Avoid counting the same check twice.
  const uniqueChecks = [
    ...new Map(
      relevantChecks.map((check) => [
        check.id ?? check.name ?? getCheckName(check),
        check,
      ])
    ).values(),
  ];

  let points = 0;
  let possiblePoints = 0;
  let assessed = 0;
  let findings = 0;
  let observations = 0;

  for (const check of uniqueChecks) {
    const state = getState(check);

    if (state === "passed") {
      points += 1;
      possiblePoints += 1;
      assessed += 1;
    } else if (state === "finding") {
      possiblePoints += 1;
      assessed += 1;
      findings += 1;
    } else if (state === "observation") {
      points += 0.5;
      possiblePoints += 1;
      assessed += 1;
      observations += 1;
    }
  }

  return {
    name: category.name,
    description: category.description,
    Icon: category.icon,
    score:
      possiblePoints > 0
        ? Math.round((points / possiblePoints) * 100)
        : null,
    assessed,
    total: uniqueChecks.length,
    findings,
    observations,
  };
}

export default function ScoredSummary({ result }) {
  const payload = useMemo(() => getPayload(result), [result]);

  const checks = useMemo(() => {
    const data =
      payload?.results ??
      payload?.checks ??
      payload?.scan_results ??
      [];

    return Array.isArray(data) ? data : [];
  }, [payload]);

  const categories = useMemo(
    () =>
      CATEGORIES.map((category) =>
        calculateCategory(checks, category)
      ),
    [checks]
  );

  return (
    <section className="scored-summary" id="scored-summary">
      <div className="scored-summary-grid">
        {categories.map((category) => {
          const Icon = category.Icon;

          return (
            <article
              className="scored-summary-card"
              key={category.name}
            >
              <div className="scored-summary-card-top">
                <span className="scored-summary-icon">
                  <Icon size={19} />
                </span>

                <div className="scored-summary-score">
                  {category.score === null
                    ? "—"
                    : category.score}
                  <span>
                    {category.score === null ? "" : " /100"}
                  </span>
                </div>
              </div>

              <h3>{category.name}</h3>
              <p>{category.description}</p>

              <div className="scored-summary-progress">
                <span
                  style={{
                    width: `${category.score ?? 0}%`,
                  }}
                />
              </div>

              <div className="scored-summary-meta">
                <span>
                  {category.assessed}/{category.total} assessed
                </span>

                {category.findings > 0 && (
                  <span>
                    {category.findings} finding
                    {category.findings === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="scored-summary-method">
        <span>SCORING METHODOLOGY</span>

        <p>
          Passed checks receive 1 point, observations receive 0.5
          points, and findings receive 0 points. The score is the
          percentage of available points among assessed checks.
          Unknown and unable-to-assess results are excluded. This
          is a heuristic indicator, not a formal security
          certification or proof that a website is secure.
        </p>
      </div>
    </section>
  );
}
