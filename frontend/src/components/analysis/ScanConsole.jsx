import { useEffect, useRef } from "react";
import "../../styles/analysis/ScanConsole.css";

export default function ScanConsole({
  checks,
  completed,
  currentCheck,
  target,
}) {
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop =
        consoleRef.current.scrollHeight;
    }
  }, [completed]);

  return (
    <div className="scan-console">

      <div className="console-header">

        <div className="console-title">
          <span className="console-prompt">&gt;_</span>
          <span>CYALYSIS — SECURITY ENGINE</span>
        </div>

        <div className="console-status">
          <span className="console-status-dot"></span>
          LIVE
        </div>

      </div>


      <div className="console-body" ref={consoleRef}>

        <div className="console-intro">
          <span>&gt;&gt;&gt;</span>
          CYALYSIS SECURITY ANALYSIS ENGINE
        </div>

        <div className="console-target">
          TARGET: {target || "example.com"}
        </div>

        {checks.map((check, index) => {

          const isComplete = index < completed;
          const isCurrent = index === completed;

          return (
            <div
              className={`console-line ${
                isComplete
                  ? "complete"
                  : isCurrent
                    ? "running"
                    : "pending"
              }`}
              key={check}
            >
              <span className="console-symbol">
                {isComplete
                  ? "✓"
                  : isCurrent
                    ? "→"
                    : "○"}
              </span>

              <span className="console-check">
                {check}
              </span>

              <span className="console-state">
                {isComplete
                  ? "COMPLETE"
                  : isCurrent
                    ? "RUNNING..."
                    : "QUEUED"}
              </span>
            </div>
          );
        })}

        {completed >= checks.length && (
          <div className="console-complete">
            <span>✓</span>
            SECURITY ANALYSIS COMPLETE
          </div>
        )}

      </div>

      <div className="console-footer">
        <span>
          {completed} / {checks.length} CHECKS
        </span>

        <span>
          {currentCheck}
        </span>
      </div>

    </div>
  );
}