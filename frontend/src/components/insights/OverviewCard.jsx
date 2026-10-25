
export default function OverviewCard({
  label,
  value,
  secondary,
  variant = "",
  wide = false,
  progress,
}) {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "Unavailable"
      : value;

  return (
    <article
      className={`overview-card ${wide ? "overview-card-wide" : ""} ${variant}`}
    >
      <span className="overview-card-label">{label}</span>

      <div className="overview-card-value">{displayValue}</div>

      {progress !== undefined && progress !== null && (
        <div className="overview-card-progress">
          <div
            className="overview-card-progress-fill"
            style={{
              width: `${Math.max(0, Math.min(100, progress))}%`,
            }}
          />
        </div>
      )}

      {secondary && (
        <span className="overview-card-secondary">{secondary}</span>
      )}
    </article>
  );
}
