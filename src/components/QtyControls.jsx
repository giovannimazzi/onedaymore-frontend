export default function QtyControls({
  quantity,
  quantityAvailable = null,
  onIncrease,
  onDecrease,
  className = "",
}) {
  const isAtMaximumStock =
    quantityAvailable != null && quantity >= quantityAvailable;

  return (
    <div
      className={`product-quantity-controls product-quantity-controls--gold ${className}`.trim()}
    >
      <button
        type="button"
        className="btn btn-primary product-quantity-button"
        onClick={onDecrease}
        aria-label="Diminuisci quantità"
      >
        −
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
