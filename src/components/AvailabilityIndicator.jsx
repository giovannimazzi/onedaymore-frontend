export default function AvailabilityIndicator({
  remaining,
  showWhenAvailable = true,
  className = "",
}) {
  if (remaining === null) {
    if (!showWhenAvailable) return null;
    return (
      <p className={`availability-indicator ${className}`.trim()}>
        <i className="bi bi-check-circle-fill me-1" aria-hidden />
        Disponibile
      </p>
    );
  }

  if (remaining <= 0) {
    return (
      <p className={`availability-indicator availability-indicator--out ${className}`.trim()}>
        <i className="bi bi-x-circle-fill me-1" aria-hidden />
        Non più disponibile
      </p>
    );
  }

  if (remaining <= 10) {
    return (
      <p className={`availability-indicator availability-indicator--low ${className}`.trim()}>
        <i className="bi bi-check-circle-fill me-1" aria-hidden />
        Ne rimangono solo {remaining}
      </p>
    );
  }

  if (!showWhenAvailable) return null;

  return (
    <p className={`availability-indicator ${className}`.trim()}>
      <i className="bi bi-check-circle-fill me-1" aria-hidden />
      Disponibile
    </p>
  );
}
