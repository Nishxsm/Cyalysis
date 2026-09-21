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
   * Start the scan.
   */
  useEffect(() => {
    let cancelled = false;

    async function startScan() {
      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target,
          }),
        });

        const data = await response.json();

        if (!response.ok || data.status !== "started") {
          throw new Error(data.error || "Unable to start scan.");
        }

        if (!cancelled) {
          setScanId(data.scan_id);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      }
    }

    startScan();

    return () => {
      cancelled = true;
    };
  }, [target]);

  /*
   * Poll scanner progress.
   */
  useEffect(() => {
    if (!scanId) {
      return;
    }

    let cancelled = false;
    let intervalId;

    async function fetchProgress() {
      try {
        const response = await fetch(
          `/api/scan/${scanId}/progress`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to read scan progress."
          );
        }

        if (cancelled) {
          return;
        }

        setProgress(data);

        /*
         * Once Python has completed all checks,
         * fetch the final scanner result.
         */
        if (data.status === "completed") {
          clearInterval(intervalId);

          const resultResponse = await fetch(
            `/api/scan/${scanId}/result`
          );

          const result = await resultResponse.json();

          if (!resultResponse.ok) {
            throw new Error(
              result.error || "Unable to retrieve scan result."
            );
          }

          navigate(`/insights/${scanId}`, {
            state: {
              result,
            },
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          clearInterval(intervalId);
        }
      }
    }

    fetchProgress();

    intervalId = setInterval(fetchProgress, 500);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [scanId, navigate]);

  const percentage =
    progress.total > 0
      ? Math.round(
          (progress.completed / progress.total) * 100
        )
      : 0;

  if (error) {
    return (
      <section className="scan-progress-page">
        <div className="scan-error">
          <p className="scan-error-label">SCAN ERROR</p>

          <h2>{error}</h2>

          <p>
            The scanner could not complete the request. Check
            that the CodeIgniter backend is running.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="scan-progress-page">
      <div className="scan-progress-container">

        <div className="scan-progress-header">
          <div>
            <span className="scan-label">
              CYALYSIS / SCAN
            </span>

            <h1>Analyzing target.</h1>

            <p className="scan-target">
              {target}
            </p>
          </div>

          <div className="scan-percentage">
            {percentage}%
          </div>
        </div>

        <div className="scan-progress-bar">
          <div
            className="scan-progress-fill"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <div className="scan-progress-meta">
          <span>
            {progress.completed} / {progress.total} checks
          </span>

          <span>
            {progress.status === "completed"
              ? "SCAN COMPLETE"
              : "SCANNING"}
          </span>
        </div>

        <div className="scan-current">
          <span className="scan-current-label">
            CURRENT CHECK
          </span>

          <div className="scan-current-value">
            <span className="scan-status-dot" />

            {progress.current_check ||
              "Initializing scanner..."}
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