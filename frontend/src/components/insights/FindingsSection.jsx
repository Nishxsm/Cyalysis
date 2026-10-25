
import { useMemo, useState } from "react";
import {
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react";

import "../../styles/insights/FindingsSection.css";

const SEVERITY_ORDER = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

function getPayload(result) {
  return result?.result ?? result?.data ?? result ?? {};
}

function normalizeSeverity(value) {
  const severity = String(value ?? "unknown").toLowerCase().trim();

  if (severity in SEVERITY_ORDER) {
    return severity;
  }

  return "unknown";
}

function getFindings(payload) {
  return Array.isArray(payload?.findings) ? payload.findings : [];
}

function getCheckResults(payload) {
  const results = payload?.results ?? payload?.checks ?? [];
  return Array.isArray(results) ? results : [];
}

function getState(check) {
  if (check?.assessment?.state) {
    return check.assessment.state;
  }

  const status = String(check?.status ?? "").toLowerCase();

  if (status === "passed") return "passed";
  if (status === "failed") return "unable_to_assess";

  return "unknown";
}

function getStatusSummary(checks) {
  return checks.reduce(
    (summary, check) => {
      const state = getState(check);

      if (state in summary) {
        summary[state] += 1;
      } else {
        summary.unknown += 1;
      }

      return summary;
    },
    {
      passed: 0,
      finding: 0,
      observation: 0,
      unable_to_assess: 0,
      unknown: 0,
    }
  );
}

function SeverityIcon({ severity }) {
  if (severity === "critical" || severity === "high") {
    return <AlertTriangle size={16} />;
  }

  if (severity === "medium" || severity === "low") {
    return <ShieldAlert size={16} />;
  }

  return <Info size={16} />;
}

function FindingCard({ finding, index }) {
  const [expanded, setExpanded] = useState(index === 0);

  const severity = normalizeSeverity(finding.severity);

  return (
    <article className="finding-card">
      <button
        type="button"
        className="finding-card-toggle"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        <span className={`finding-severity-icon severity-${severity}`}>
          <SeverityIcon severity={severity} />
        </span>

        <span className="finding-card-heading">
          <span className="finding-card-title">
            {finding.title || "Untitled finding"}
          </span>

          <span className="finding-card-meta">
            <span>{finding.category || "Uncategorized"}</span>
            <span className="finding-meta-divider" />
            <span className={`finding-severity-text severity-text-${severity}`}>
              {severity.replace(/^./, (letter) => letter.toUpperCase())}
            </span>
          </span>
        </span>

        <span className="finding-card-chevron">
          {expanded ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </span>
      </button>

      {expanded && (
        <div className="finding-card-details">
          {finding.description && (
            <div className="finding-detail-block">
              <span className="finding-detail-label">DESCRIPTION</span>
              <p>{finding.description}</p>
            </div>
          )}

          {finding.evidence && (
            <div className="finding-evidence">
              <span className="finding-detail-label">DETECTED EVIDENCE</span>
              <pre>{String(finding.evidence)}</pre>
            </div>
          )}

          {finding.impact && (
            <div className="finding-detail-block">
              <span className="finding-detail-label">POTENTIAL IMPACT</span>
              <p>{finding.impact}</p>
            </div>
          )}

          {finding.remediation && (
            <div className="finding-remediation">
              <span className="finding-detail-label">RECOMMENDED REMEDIATION</span>
              <p>{finding.remediation}</p>
            </div>
          )}

          {Array.isArray(finding.references) &&
            finding.references.length > 0 && (
              <div className="finding-reference-list">
                <span className="finding-detail-label">REFERENCES</span>

                <div>
                  {finding.references.map((reference, referenceIndex) => (
                    <span
                      className="finding-reference"
                      key={`${reference}-${referenceIndex}`}
                    >
                      <ExternalLink size={12} />
                      {reference}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </article>
  );
}

export default function FindingsSection({ result }) {
  const payload = useMemo(() => getPayload(result), [result]);

  const findings = useMemo(
    () => getFindings(payload),
    [payload]
  );

  const checks = useMemo(
    () => getCheckResults(payload),
    [payload]
  );

  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const statusSummary = useMemo(
    () => getStatusSummary(checks),
    [checks]
  );

  const categories = useMemo(
    () => [
      ...new Set(
        findings
          .map((finding) => finding.category)
          .filter(Boolean)
      ),
    ].sort(),
    [findings]
  );

  const filteredFindings = useMemo(
    () =>
      findings
        .filter((finding) => {
          const severity = normalizeSeverity(finding.severity);

          const matchesSeverity =
            severityFilter === "all" ||
            severity === severityFilter;

          const matchesCategory =
            categoryFilter === "all" ||
            finding.category === categoryFilter;

          return matchesSeverity && matchesCategory;
        })
        .sort(
          (a, b) =>
            (SEVERITY_ORDER[normalizeSeverity(a.severity)] ?? 99) -
            (SEVERITY_ORDER[normalizeSeverity(b.severity)] ?? 99)
        ),
    [findings, severityFilter, categoryFilter]
  );

  return (
    <section className="findings-section" id="findings">
      <div className="findings-section-heading">
        <div className="findings-heading-icon">
          <ShieldAlert size={20} />
        </div>

        <div>
          <span className="findings-eyebrow">02 / SECURITY REVIEW</span>
          <h2>Findings</h2>
          <p>
            Detected security issues, supporting evidence, and recommended fixes.
          </p>
        </div>
      </div>

      <div className="findings-summary">
        <div className="findings-total">
          <span className="findings-total-number">{findings.length}</span>
          <span className="findings-total-label">
            {findings.length === 1 ? "Finding detected" : "Findings detected"}
          </span>
        </div>

        <div className="findings-status-list">
          <span>
            <i className="finding-status-dot status-dot-finding" />
            {statusSummary.finding} findings
          </span>

          <span>
            <i className="finding-status-dot status-dot-passed" />
            {statusSummary.passed} passed
          </span>

          <span>
            <i className="finding-status-dot status-dot-observation" />
            {statusSummary.observation} observations
          </span>
        </div>
      </div>

      <div className="findings-toolbar">
        <div className="findings-filter">
          <label htmlFor="finding-severity-filter">Severity</label>
          <select
            id="finding-severity-filter"
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
          >
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
            <option value="unknown">Unspecified</option>
          </select>
        </div>

        <div className="findings-filter">
          <label htmlFor="finding-category-filter">Category</label>
          <select
            id="finding-category-filter"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <span className="findings-result-count">
          {filteredFindings.length} of {findings.length}
        </span>
      </div>

      {filteredFindings.length > 0 ? (
        <div className="findings-list">
          {filteredFindings.map((finding, index) => (
            <FindingCard
              key={`${finding.title}-${finding.category}-${index}`}
              finding={finding}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="findings-empty">
          <span className="findings-empty-icon">
            <ShieldCheck size={25} />
          </span>

          <h3>
            {findings.length === 0
              ? "No findings returned"
              : "No matching findings"}
          </h3>

          <p>
            {findings.length === 0
              ? "The scanner returned no findings for this scan. Review the complete check results before concluding that the target has no security issues."
              : "Try changing the severity or category filters to see other findings."}
          </p>

          {(severityFilter !== "all" || categoryFilter !== "all") && (
            <button
              type="button"
              className="findings-reset-button"
              onClick={() => {
                setSeverityFilter("all");
                setCategoryFilter("all");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div className="findings-disclaimer">
        Findings are based on the scanner's configured checks and observed
        responses. They require context-specific review and do not, by
        themselves, establish that a target is exploitable.
      </div>
    </section>
  );
}
