import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/layout/Admin.css";

const FILTERS = ["all", "running", "queued", "completed", "failed"];

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({ label, value, detail, accent }) {
  return (
    <article className={`admin-stat-card ${accent || ""}`}>
      <div className="admin-stat-top">
        <span>{label}</span>
        <span className="admin-stat-indicator" />
      </div>

      <strong className="admin-stat-value">{value ?? 0}</strong>
      <span className="admin-stat-detail">{detail}</span>
    </article>
  );
}

export default function Admin() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (background = false) => {
    if (background) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/admin/dashboard", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (response.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      if (response.status === 403) {
        setError("Administrator access required.");
        setDashboard(null);
        return;
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to load dashboard.");
      }

      setDashboard(data);
      setError("");
    } catch (err) {
      setError(
        err.message || "Could not connect to the CYALYSIS backend."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboard();

    const interval = window.setInterval(() => {
      loadDashboard(true);
    }, 10000);

    return () => window.clearInterval(interval);
  }, [loadDashboard]);

  const filteredScans = useMemo(() => {
    const scans = dashboard?.scans || [];
    const term = search.trim().toLowerCase();

    return scans.filter((scan) => {
      const statusMatches =
        filter === "all" || scan.status === filter;

      const searchable = [
        scan.id,
        scan.target_url,
        scan.user_name,
        scan.user_email,
        scan.user_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return statusMatches && (!term || searchable.includes(term));
    });
  }, [dashboard, filter, search]);

  const stats = dashboard?.stats || {};

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div className="admin-brand">

            <div>
              <div className="admin-brand-name">
                CYALYSIS<span>.</span>
              </div>
              <div className="admin-brand-subtitle">
                SECURITY OPERATIONS
              </div>
            </div>
          </div>

          <div className="admin-header-right">
            <div className="admin-live-status">
              <span className="admin-live-dot" />
              ADMIN CONSOLE
            </div>

            <button
              className="admin-exit-button"
              onClick={() => navigate("/")}
              type="button"
            >
              EXIT CONSOLE
            </button>
          </div>
        </header>

        <section className="admin-intro">
          <div>
            <div className="admin-eyebrow">
              <span>SYS.01</span>
              / CONTROL CENTER
            </div>

            <h1>
              System <span>Overview</span>
            </h1>

            <p>
              Monitor scan activity, track system usage, and inspect
              recent assessment records.
            </p>
          </div>

          <button
            className="admin-refresh-button"
            type="button"
            onClick={() => loadDashboard(true)}
            disabled={refreshing || loading}
          >
            <span className={refreshing ? "admin-refresh-spin" : ""}>
              ↻
            </span>
            {refreshing ? "REFRESHING" : "REFRESH DATA"}
          </button>
        </section>

        {error && (
          <div className="admin-error" role="alert">
            <span className="admin-error-symbol">!</span>
            <div>
              <strong>REQUEST FAILED</strong>
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => loadDashboard()}
            >
              RETRY
            </button>
          </div>
        )}

        <section className="admin-stats-grid">
          <StatCard
            label="REGISTERED USERS"
            value={stats.users}
            detail="Accounts in the system"
            accent="stat-cyan"
          />

          <StatCard
            label="TOTAL SCANS"
            value={stats.total}
            detail="All recorded assessments"
          />

          <StatCard
            label="ACTIVE SCANS"
            value={stats.running}
            detail={`${stats.queued ?? 0} scan(s) queued`}
            accent="stat-blue"
          />

          <StatCard
            label="COMPLETED"
            value={stats.completed}
            detail="Successfully completed"
            accent="stat-green"
          />

          <StatCard
            label="FAILED"
            value={stats.failed}
            detail="Failed scan records"
            accent="stat-red"
          />
        </section>

        <section className="admin-table-panel">
          <div className="admin-panel-heading">
            <div>
              <div className="admin-eyebrow">
                <span>LOG.01</span>
                / ACTIVITY MONITOR
              </div>

              <h2>Scan History</h2>

              <p>
                Latest assessment records received from the backend.
              </p>
            </div>

            <div className="admin-record-count">
              <span className="admin-live-dot" />
              {filteredScans.length} RECORDS
            </div>
          </div>

          <div className="admin-toolbar">
            <label className="admin-search">
              <span className="admin-search-icon">⌕</span>
              <input
                type="search"
                placeholder="Search ID, target, user..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span className="admin-search-shortcut">SEARCH</span>
            </label>

            <div className="admin-filters" aria-label="Filter scans">
              {FILTERS.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">
              <span className="admin-loader" />
              <span>CONNECTING TO SYSTEM...</span>
            </div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SCAN ID</th>
                    <th>TARGET</th>
                    <th>INITIATED BY</th>
                    <th>STATUS</th>
                    <th>STARTED AT</th>
                    <th>COMPLETED AT</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredScans.map((scan) => {
                    const started = scan.started_at
                      ? new Date(
                          scan.started_at.replace(" ", "T")
                        ).getTime()
                      : NaN;

                    const isStale =
                      scan.status === "running" &&
                      Number.isFinite(started) &&
                      Date.now() - started > 10 * 60 * 1000;

                    return (
                      <tr key={scan.id}>
                        <td className="admin-scan-id">
                          #{String(scan.id).padStart(4, "0")}
                        </td>

                        <td>
                          <span
                            className="admin-target"
                            title={scan.target_url}
                          >
                            {scan.target_url || "—"}
                          </span>
                        </td>

                        <td>
                          <div className="admin-user-cell">
                            <span className="admin-user-avatar">
                              {(scan.user_name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                            <div>
                              <strong>
                                {scan.user_name || `User ${scan.user_id}`}
                              </strong>
                              <span>
                                {scan.user_email || "Unknown email"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="admin-status-cell">
                            <span
                              className={`admin-status status-${scan.status}`}
                            >
                              <span />
                              {scan.status || "unknown"}
                            </span>

                            {isStale && (
                              <span className="admin-stale-warning">
                                OVER 10 MIN
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="admin-date">
                          {formatDate(scan.started_at)}
                        </td>

                        <td className="admin-date">
                          {formatDate(scan.completed_at)}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredScans.length === 0 && (
                    <tr>
                      <td colSpan="6">
                        <div className="admin-empty">
                          <span>NO MATCHING RECORDS</span>
                          <p>
                            Try another search term or status filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <footer className="admin-table-footer">
            <span>
              DISPLAYING {filteredScans.length} OF{" "}
              {dashboard?.scans?.length ?? 0} LOADED RECORDS
            </span>

            <span>
              AUTO-REFRESH <strong>10S</strong>
            </span>
          </footer>
        </section>

        <footer className="admin-page-footer">
          <span>CYALYSIS / ADMINISTRATOR INTERFACE</span>

          <span>
            LAST SYNC:{" "}
            {dashboard?.generated_at
              ? formatDate(dashboard.generated_at)
              : "WAITING FOR DATA"}
          </span>
        </footer>
      </div>
    </main>
  );
}