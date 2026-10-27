import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/analysis/ScanProgress.css";
import ScanConsole from "./ScanConsole";

export default function ScanProgress({ target }) {
  const navigate = useNavigate();

  const [scanId, setScanId] = useState(null);

  const [progress, setProgress] = useState({
    status: "starting",
    current_check: null,
    completed: 0,
    total: 57,
  });

  const [error, setError] = useState(null);

  /*
   * Start a scan using the existing login session.
   */
  useEffect(() => {
    let cancelled = false;

    async function startScan() {
      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ target }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.status !== "started") {
          if (response.status === 401) {
            throw new Error(
              "Your session was not recognized. Please log in again."
            );
          }

          throw new Error(data.error || "Unable to start scan.");
        }

        if (!cancelled) {
          setScanId(data.scan_id);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to start scan.");
        }
      }
    }

    if (target) {
      startScan();
    } else {
      setError("Please provide a target URL.");
    }

    return () => {
      cancelled = true;
    };
  }, [target]);

  /*
   * Poll progress and retrieve the final result.
   */
  useEffect(() => {
    if (!scanId) return;

    let cancelled = false;
    let intervalId = null;
    let fetching = false;

    async function fetchProgress() {
      if (fetching || cancelled) return;

      fetching = true;

      try {
        const response = await fetch(
          `/api/scan/${scanId}/progress`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session expired. Please log in again."
            );
          }

          throw new Error(
            data.error || "Unable to read scan progress."
          );
        }

        if (cancelled) return;

        setProgress(data);

        /*
         * Stop polling immediately when the scanner fails or times out.
         */
        if (data.status === "failed") {
          if (intervalId !== null) {
            clearInterval(intervalId);
          }

          setError(data.error || "The scan failed.");
          return;
        }

        /*
         * Retrieve results once the scanner reports completion.
         */
        if (data.status === "completed") {
          if (intervalId !== null) {
            clearInterval(intervalId);
          }

          const resultResponse = await fetch(
            `/api/scan/${scanId}/result`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                Accept: "application/json",
              },
            }
          );

          const result = await resultResponse.json().catch(() => ({}));

          if (!resultResponse.ok) {
            throw new Error(
              result.error || "Unable to retrieve scan result."
            );
          }

          if (result.status === "failed") {
            throw new Error(result.error || "The scan failed.");
          }

          if (!cancelled) {
            navigate(`/insights/${scanId}`, {
              state: { result },
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "An error occurred while scanning."
          );

          if (intervalId !== null) {
            clearInterval(intervalId);
          }
        }
      } finally {
        fetching = false;
      }
    }

    fetchProgress();
    intervalId = setInterval(fetchProgress, 1000);

    return () => {
      cancelled = true;

      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [scanId, navigate]);

  const percentage =
    progress.total > 0
      ? Math.min(
          100,
          Math.round((progress.completed / progress.total) * 100)
        )
      : 0;

  if (error) {
    return (
      <section className="scan-progress-page">
        <div className="scan-error">
          <p className="scan-error-label">SCAN ERROR</p>
          <h2>{error}</h2>
          <p>
            The scan may have timed out or encountered an error.
            You can return to the analysis page and try again.
          </p>

          <button
            type="button"
            onClick={() => navigate("/analysis")}
          >
            Back to analysis
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="scan-progress-page">
      <div className="scan-progress-container">
        <div className="scan-progress-header">
          <div>
            <span className="scan-label">CYALYSIS / SCAN</span>
            <h1>Analyzing target.</h1>
            <p className="scan-target">{target}</p>
          </div>

          <div className="scan-percentage">{percentage}%</div>
        </div>

        <div
          className="scan-progress-bar"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Scan progress"
        >
          <div
            className="scan-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="scan-progress-meta">
          <span>
            {progress.completed} / {progress.total} checks
          </span>

          <span>
            {progress.status === "completed"
              ? "SCAN COMPLETE"
              : progress.status === "failed"
                ? "SCAN FAILED"
                : "SCANNING"}
          </span>
        </div>

        <div className="scan-current">
          <span className="scan-current-label">CURRENT CHECK</span>

          <div className="scan-current-value">
            <span className="scan-status-dot" />
            {progress.current_check || "Initializing scanner..."}
          </div>
        </div>

        <ScanConsole
          target={target}
          completed={progress.completed}
          total={progress.total}
          currentCheck={progress.current_check}
          status={progress.status}
        />
      </div>
    </section>
  );
}