import { useEffect, useState } from "react";
import ScanConsole from "./ScanConsole";
import "../../styles/analysis/ScanProgress.css";
import { scanChecks } from "./ScanChecks";


export default function ScanProgress({ target }) {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setCompleted(0);

    const interval = setInterval(() => {
      setCompleted((current) => {
        if (current >= scanChecks.length) {
          clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const currentCheck =
    completed < scanChecks.length
      ? scanChecks[completed]
      : "Analysis Complete";

  const progress = Math.round(
    (completed / scanChecks.length) * 100
  );

  return (
    <section className="scan-progress">

      <div className="scan-progress-header">

        <div className="scan-target">
          <span className="scan-label">TARGET</span>

          <span className="scan-target-url">
            {target || "example.com"}
          </span>
        </div>

        <div className="scan-counter">
          <span>{completed}</span>
          <span className="scan-counter-total">
            / {scanChecks.length}
          </span>
        </div>

      </div>


      <div className="scan-radar">
        <div className="radar-ring radar-ring-one"></div>
        <div className="radar-ring radar-ring-two"></div>
        <div className="radar-ring radar-ring-three"></div>

        <div className="radar-dot"></div>
      </div>


      <div className="scan-current">

        <div className="scan-current-label">
          RUNNING
        </div>

        <div className="scan-current-check">
          {currentCheck}
        </div>

        <div className="scan-progress-track">
          <div
            className="scan-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>


      <ScanConsole
        checks={scanChecks}
        completed={completed}
        currentCheck={currentCheck}
        target={target}
      />

    </section>
  );
}