import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  ShieldCheck,
  Share2,
  ArrowLeft,
  Copy,
} from "lucide-react";

import ReportExport from "./ReportExport";
import "../../styles/insights/InsightsSidebar.css";

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "scored-summary", label: "Insights", icon: Sparkles },
  { id: "findings", label: "Findings", icon: ShieldCheck },
];

export default function InsightsSidebar({ target, result }) {
  const [activeSection, setActiveSection] = useState("overview");

  const hostname = useMemo(() => {
    try {
      const input = target?.startsWith("http")
        ? target
        : `https://${target}`;

      return new URL(input).hostname;
    } catch {
      return target || "Target unavailable";
    }
  }, [target]);

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -65% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [result]);

  async function copyTarget() {
    try {
      await navigator.clipboard.writeText(target || hostname);
    } catch {
      // Clipboard access may be unavailable.
    }
  }

  function scrollToSection(id) {
    const element = document.getElementById(id);

    if (!element) return;

    setActiveSection(id);

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <aside className="insights-sidebar">
      <div className="insights-sidebar-target">
        <span className="insights-sidebar-overline">
          ANALYZING
        </span>

        <div className="insights-sidebar-domain-row">
          <strong title={hostname}>{hostname}</strong>

          <button
            type="button"
            className="insights-icon-button"
            onClick={copyTarget}
            aria-label="Copy target domain"
            title="Copy target"
          >
            <Copy size={15} />
          </button>
        </div>
      </div>

      <nav
        className="insights-sidebar-nav"
        aria-label="Report sections"
      >
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            className={`insights-sidebar-item ${
              activeSection === id ? "is-active" : ""
            }`}
            onClick={() => scrollToSection(id)}
            aria-current={
              activeSection === id ? "location" : undefined
            }
            title={label}
          >
            <Icon size={17} strokeWidth={1.7} />

            <span className="insights-sidebar-item-label">
              {label}
            </span>
          </button>
        ))}
      </nav>

      <div className="insights-sidebar-actions">
        <Link to="/analysis" className="insights-sidebar-new">
          <ArrowLeft size={17} />
          <span>New analysis</span>
        </Link>

        <div className="insights-sidebar-group-label">
          SHARE
        </div>

        <button
          type="button"
          className="insights-sidebar-action"
          disabled
          title="Public reports will be added later"
        >
          <Share2 size={17} />

          <span>
            <strong>Generate Public Report</strong>
            <small>Shareable read-only link</small>
          </span>
        </button>

        <div className="insights-sidebar-group-label">
          EXPORT
        </div>

        <ReportExport result={result} target={target} />
      </div>
    </aside>
  );
}