import { useCompareContext } from "../contexts/CompareContext";
import { useNotificationContext } from "../contexts/NotificationContext";

export default function CompareToggleButton({
  product,
  className = "",
  fullWidth = false,
  variant = "button",
}) {
  const { toggleCompare, isInCompare, isCompareFull } = useCompareContext();
  const { showNotification } = useNotificationContext();

  const inCompare = isInCompare(product.slug);
  const hideBecauseCompareFull = !inCompare && isCompareFull;

  if (hideBecauseCompareFull) {
    return null;
  }

  const handleClick = () => {
    toggleCompare(product);

    showNotification(
      inCompare
        ? "Prodotto rimosso dal confronto"
        : "Prodotto aggiunto al confronto",
      inCompare ? "muted" : "success",
      { pointer: "compare" },
    );
  };

  if (variant === "cardChip") {
    const label = inCompare
      ? "Rimuovi dal confronto"
      : "Aggiungi al confronto";

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={inCompare}
        aria-label={label}
        title={label}
        className={`product-card-compare-toggle product-card-compare-toggle--icon-only${inCompare ? " is-on" : ""}${className ? ` ${className}` : ""}`}
        onClick={handleClick}
      >
        <span className="product-card-compare-toggle__icon" aria-hidden>
          {inCompare ? (
            <i className="bi bi-check-lg" />
          ) : (
            <i className="bi bi-arrow-left-right" />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`btn btn-outline-secondary ${fullWidth ? "w-100" : ""} ${className}`.trim()}
      onClick={handleClick}
    >
      {inCompare ? "Rimuovi dal confronto" : "Confronta"}
    </button>
  );
}
