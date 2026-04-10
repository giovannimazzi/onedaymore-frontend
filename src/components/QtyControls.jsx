export default function QtyControls({
  quantity,
  quantityAvailable = null,
  onIncrease,
  onDecrease,
  className = "",
  trashWhenLast = false,
}) {
  const isAtMaximumStock =
    quantityAvailable != null && quantity >= quantityAvailable;
  const showTrash = trashWhenLast && quantity === 1;

  return (
    <div
      className={`product-quantity-controls product-quantity-controls--gold ${className}`.trim()}
    >
      <button
        type="button"
        className={`btn btn-primary product-quantity-button${showTrash ? " product-quantity-button--trash" : ""}`}
        onClick={onDecrease}
        aria-label={showTrash ? "Rimuovi dal carrello" : "Diminuisci quantità"}
      >
        {showTrash ? (
          <i className="bi bi-trash3" aria-hidden />
        ) : (
          "−"
        )}
      </button>
      <span className="product-quantity-value">{quantity}</span>
      <button
        type="button"
        className="btn btn-primary product-quantity-button"
        onClick={onIncrease}
        aria-label="Aumenta quantità"
        disabled={isAtMaximumStock}
      >
        +
      </button>
    </div>
  );
}
