export default function ScanConsole({
  target,
  completed,
  total,
  currentCheck,
  status,
}) {
  return (
    <div className="scan-console">

      <div className="scan-console-header">
        <span>SCAN CONSOLE</span>

        <span>
          {status === "completed" ? "COMPLETE" : "LIVE"}
        </span>
      </div>

      <div className="scan-console-body">

        <div className="console-line">
          <span className="console-prefix">&gt;</span>
          <span>Target: {target}</span>
        </div>

        <div className="console-line">
          <span className="console-prefix">&gt;</span>
          <span>
            Checks: {completed}/{total}
          </span>
        </div>

        <div className="console-line">
          <span className="console-prefix">&gt;</span>
          <span>
            Current: {currentCheck || "Initializing..."}
          </span>
        </div>

        <div className="console-line console-active">
          <span className="console-prefix">&gt;</span>

          <span>
            {status === "completed"
              ? "Scan completed successfully."
              : "Scanner is running..."}
          </span>
        </div>

      </div>
    </div>
  );
}