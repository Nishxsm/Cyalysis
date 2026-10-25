
export default function OverviewCard({
  label,
  value,
  secondary,
  variant = "",
  progress,
}) {
  const isUnavailable =
    value == null ||
    String(value).trim() === "" ||
    String(value).trim().toLowerCase() === "unavailable";

  const displayValue = isUnavailable ? "Unavailable" : value;

  return (
    <article className={`overview-card ${variant}`.trim()}>
      <span className="overview-card-label">{label}</span>

      <div
        className={`overview-card-value ${
          isUnavailable ? "is-unavailable" : ""
        }`.trim()}
      >
        {displayValue}
      </div>

      {!isUnavailable && secondary && (
        <span className="overview-card-secondary">
          {secondary}
        </span>
      )}

      {progress != null && !isUnavailable && (
        <div
          className="overview-card-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="overview-card-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </article>
  );
}
