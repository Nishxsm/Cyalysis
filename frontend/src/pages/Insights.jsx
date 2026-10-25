
import { useLocation, Link } from "react-router-dom";

import InsightsSidebar from "../components/insights/InsightsSidebar";
import OverviewSection from "../components/insights/OverviewSection";
import ScoredSummary from "../components/insights/ScoredSummary";
import FindingsSection from "../components/insights/FindingsSection";
import InsightsSection from "../components/insights/InsightsSection";

import "../styles/insights/Insights.css";
import "../styles/insights/InsightsPrint.css";

export default function Insights() {
  const location = useLocation();

  const result = location.state?.result ?? null;
  const payload = result?.result ?? result?.data ?? result ?? {};

  const target =
    payload?.target_url ??
    payload?.target ??
    payload?.url ??
    "Target unavailable";

  if (!result) {
    return (
      <main className="insights-layout insights-layout-empty">
        <section className="insights-empty-state">
          <span className="insights-page-label">
            CYALYSIS / REPORT
          </span>

          <h1>Report unavailable.</h1>

          <p>
            Start a scan from the Analysis page to view its results.
          </p>

          <Link to="/analysis" className="insights-return-link">
            Return to analysis <span>↗</span>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="insights-layout">
      <InsightsSidebar target={target} result={result} />

      <div className="insights-main">
        <OverviewSection result={result} />

        <ScoredSummary result={result} />

        <FindingsSection result={result} />

        <InsightsSection result={result} />
      </div>
    </main>
  );
}
