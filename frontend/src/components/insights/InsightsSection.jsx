
import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ShieldCheck,
  CircleAlert,
  CircleHelp,
  Eye,
  CircleX,
  ListChecks,
} from "lucide-react";

import "../../styles/insights/InsightsSection.css";

const STATUS_META = {
  finding: {
    label: "Finding",
    className: "finding",
    icon: CircleAlert,
  },
  passed: {
    label: "Passed",
    className: "passed",
    icon: ShieldCheck,
  },
  observation: {
    label: "Observation",
    className: "observation",
    icon: Eye,
  },
  unable_to_assess: {
    label: "Unable to assess",
    className: "unable",
    icon: CircleX,
  },
  unknown: {
    label: "Unknown",
    className: "unknown",
    icon: CircleHelp,
  },
};

const CATEGORY_GROUPS = [
  {
    name: "Target & Reconnaissance",
    keywords: [
      "url validation",
      "domain resolution",
      "ip resolution",
      "port identification",
      "dns ",
    ],
  },
  {
    name: "HTTP & Connection",
    keywords: [
      "http status",
      "https ",
      "redirect",
      "response header",
      "server banner",
      "response time",
      "content-type",
      "http version",
    ],
  },
  {
    name: "Technology Detection",
    keywords: [
      "web server",
      "framework",
      "cms detection",
      "library detection",
      "cdn detection",
    ],
  },
  {
    name: "Security Headers",
    keywords: [
      "csp ",
      "hsts ",
      "x-content-type",
      "clickjacking",
      "referrer policy",
      "permissions policy",
      "security header",
    ],
  },
  {
    name: "Cookie Security",
    keywords: [
      "cookie",
      "secure flag",
      "httponly",
      "samesite",
    ],
  },
  {
    name: "CORS",
    keywords: ["cors"],
  },
  {
    name: "Transport Security",
    keywords: [
      "certificate",
      "tls ",
      "tls version",
      "hostname verification",
      "cipher configuration",
    ],
  },
  {
    name: "Information Exposure",
    keywords: [
      "version disclosure",
      "debug information",
      "verbose error",
      "metadata disclosure",
      "metadata analysis",
    ],
  },
  {
    name: "HTTP Methods",
    keywords: [
      "http method",
      "options analysis",
      "method restriction",
      "trace analysis",
      "unsupported method",
    ],
  },
];

function getPayload(result) {
  return result?.result ?? result?.data ?? result ?? {};
}

function getResults(payload) {
  const candidates = [
    payload?.results,
    payload?.checks,
    payload?.scan_results,
    payload?.check_results,
  ];

  return candidates.find(Array.isArray) ?? [];
}

function getName(check) {
  return String(
    check?.name ??
      check?.check_name ??
      check?.title ??
      check?.check ??
      "Unnamed check"
  );
}

function getCanonicalName(check) {
  return String(
    check?.assessment?.canonical_name ??
      check?.canonical_name ??
      getName(check)
  );
}

function getState(check) {
  const state = check?.assessment?.state;

  if (state && STATUS_META[state]) return state;

  const status = String(check?.status ?? "").toLowerCase();

  if (status === "passed") return "passed";
  if (status === "failed") return "unable_to_assess";

  return "unknown";
}

function getCategory(check) {
  if (check?.category) return String(check.category);

  const name = getCanonicalName(check).toLowerCase();

  const group = CATEGORY_GROUPS.find((item) =>
    item.keywords.some((keyword) => name.includes(keyword))
  );

  return group?.name ?? "Other Checks";
}

function getEvidence(check) {
  const value =
    check?.evidence ??
    check?.message ??
    check?.description ??
    check?.output ??
    check?.details ??
    check?.value;

  if (value == null || value === "") {
    return "The scanner did not return evidence for this check.";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

function getSeverity(check) {
  const severity = String(check?.severity ?? "").toLowerCase();

  if (["critical", "high", "medium", "low", "info"].includes(severity)) {
    return severity;
  }

  return null;
}

function CheckDetails({ check, meta, className = "" }) {
  return (
    <div className={`insights-check-details ${className}`}>
      <div className="insights-check-detail-block">
        <span>ASSESSMENT</span>
        <p>{meta.label}</p>
      </div>

      <div className="insights-check-detail-block">
        <span>CANONICAL NAME</span>
        <p>{check._canonical}</p>
      </div>

      <div className="insights-check-detail-block">
        <span>EVIDENCE / OUTPUT</span>
        <pre>{check._evidence}</pre>
      </div>

      {check?.assessment?.scorable !== undefined && (
        <div className="insights-check-detail-note">
          {check.assessment.scorable
            ? "Included in the configured scoring rules."
            : "Not included in the configured scoring rules."}
        </div>
      )}
    </div>
  );
}

export default function InsightsSection({ result }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [expandedChecks, setExpandedChecks] = useState({});

  const payload = useMemo(() => getPayload(result), [result]);

  const checks = useMemo(() => {
    return getResults(payload).map((check, index) => ({
      ...check,
      _key: `${getName(check)}-${index}`,
      _name: getName(check),
      _canonical: getCanonicalName(check),
      _state: getState(check),
      _category: getCategory(check),
      _evidence: getEvidence(check),
      _severity: getSeverity(check),
    }));
  }, [payload]);

  const categories = useMemo(
    () => [...new Set(checks.map((check) => check._category))].sort(),
    [checks]
  );

  const counts = useMemo(() => {
    const summary = {
      total: checks.length,
      finding: 0,
      passed: 0,
      observation: 0,
      unable_to_assess: 0,
      unknown: 0,
    };

    checks.forEach((check) => {
      summary[check._state] += 1;
    });

    return summary;
  }, [checks]);

  const filteredChecks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return checks.filter((check) => {
      const matchesSearch =
        !query ||
        check._name.toLowerCase().includes(query) ||
        check._canonical.toLowerCase().includes(query) ||
        check._category.toLowerCase().includes(query) ||
        check._evidence.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "all" ||
        check._category === selectedCategory;

      const matchesState =
        selectedState === "all" ||
        check._state === selectedState;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [checks, search, selectedCategory, selectedState]);

  const groupedChecks = useMemo(() => {
    return filteredChecks.reduce((groups, check) => {
      if (!groups[check._category]) {
        groups[check._category] = [];
      }

      groups[check._category].push(check);
      return groups;
    }, {});
  }, [filteredChecks]);

  function toggleCheck(key) {
    setExpandedChecks((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <section className="insights-checks-section" id="insights">
      <div className="insights-checks-heading">
        <div className="insights-checks-heading-icon">
          <ListChecks size={20} />
        </div>

        <div>
          <span className="insights-section-eyebrow">
            FULL SCAN BREAKDOWN
          </span>

          <h2>Insights</h2>

          <p>
            Review every check performed during the scan, including its
            assessment status and returned evidence.
          </p>
        </div>

        <div className="insights-checks-total">
          <strong>{counts.total}</strong>
          <span>checks</span>
        </div>
      </div>

      <div className="insights-state-summary">
        {Object.entries(STATUS_META).map(([state, meta]) => {
          const Icon = meta.icon;

          return (
            <div
              className={`insights-state-count ${meta.className}`}
              key={state}
            >
              <Icon size={15} />
              <span>{meta.label}</span>
              <strong>{counts[state]}</strong>
            </div>
          );
        })}
      </div>

      <div className="insights-checks-toolbar">
        <label className="insights-check-search">
          <Search size={16} />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search checks, categories, or evidence..."
            aria-label="Search scan checks"
          />
        </label>

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          aria-label="Filter checks by category"
        >
          <option value="all">All categories</option>

          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedState}
          onChange={(event) => setSelectedState(event.target.value)}
          aria-label="Filter checks by status"
        >
          <option value="all">All statuses</option>

          {Object.entries(STATUS_META).map(([state, meta]) => (
            <option value={state} key={state}>
              {meta.label}
            </option>
          ))}
        </select>

        <span className="insights-checks-result-count">
          {filteredChecks.length} of {checks.length}
        </span>
      </div>

      {checks.length === 0 ? (
        <div className="insights-checks-empty">
          <CircleHelp size={22} />

          <h3>No check results found</h3>

          <p>
            The scan payload did not contain a results array. Check that the
            backend returns its normalized checks under <code>results</code>.
          </p>
        </div>
      ) : filteredChecks.length === 0 ? (
        <div className="insights-checks-empty">
          <Search size={22} />

          <h3>No matching checks</h3>
          <p>Try changing the search term or filters.</p>
        </div>
      ) : (
        <div className="insights-check-groups">
          {Object.entries(groupedChecks).map(([category, items]) => (
            <section className="insights-check-group" key={category}>
              <div className="insights-check-group-heading">
                <div>
                  <span className="insights-section-eyebrow">
                    CHECK CATEGORY
                  </span>

                  <h3>{category}</h3>
                </div>

                <span className="insights-check-group-count">
                  {items.length} {items.length === 1 ? "check" : "checks"}
                </span>
              </div>

              <div className="insights-check-list">
                {items.map((check) => {
                  const meta = STATUS_META[check._state];
                  const Icon = meta.icon;
                  const isExpanded = Boolean(expandedChecks[check._key]);

                  return (
                    <article
                      className={`insights-check-item ${meta.className} ${
                        isExpanded ? "is-expanded" : ""
                      }`}
                      key={check._key}
                    >
                      <button
                        type="button"
                        className="insights-check-trigger"
                        onClick={() => toggleCheck(check._key)}
                        aria-expanded={isExpanded}
                        aria-controls={`check-details-${check._key}`}
                      >
                        <span className="insights-check-status-icon">
                          <Icon size={17} />
                        </span>

                        <span className="insights-check-main">
                          <strong>{check._name}</strong>

                          <span className="insights-check-meta">
                            <span>{meta.label}</span>

                            {check._severity && (
                              <>
                                <span className="insights-meta-separator">
                                  /
                                </span>

                                <span
                                  className={`insights-severity ${check._severity}`}
                                >
                                  {check._severity}
                                </span>
                              </>
                            )}
                          </span>
                        </span>

                        <ChevronDown
                          size={17}
                          className="insights-check-chevron"
                        />
                      </button>

                      {isExpanded && (
                        <div id={`check-details-${check._key}`}>
                          <CheckDetails check={check} meta={meta} />
                        </div>
                      )}

                      <CheckDetails
                        check={check}
                        meta={meta}
                        className="insights-print-only-details"
                      />
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="insights-checks-disclaimer">
        Results reflect the checks and evidence returned by the scanner.
        Unknown and unable-to-assess results are not proof of a vulnerability
        or proof that a control is secure.
      </p>
    </section>
  );
}
