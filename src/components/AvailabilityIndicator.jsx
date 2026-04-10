import { useCartContext } from "../contexts/CartContext";
import { useAvailability } from "../hooks/useAvailability";

export default function AvailabilityIndicator({
  slug,
  quantityAvailable,
  className = "",
}) {
  const { cart } = useCartContext();
  
  const cartItem = cart.find((line) => line.slug === slug);
  const quantityInCart = cartItem?.quantity ?? 0;

  const { remaining, isWarehouseEmpty, isCartLimitReached } = useAvailability(
    quantityAvailable,
    quantityInCart,
  );

  if (remaining !== null && remaining <= 0) {
    const outMessage = isWarehouseEmpty
      ? "Esaurito in magazzino"
      : isCartLimitReached
        ? "Quantità massima raggiunta"
        : "Non più disponibile";

    const outVariantClass = isCartLimitReached
      ? "availability-indicator--cart-limit"
      : "availability-indicator--out";

    return (
      <p
        className={`availability-indicator ${outVariantClass} ${className}`.trim()}
      >
        <i className="bi bi-x-circle-fill me-1" aria-hidden />
        {outMessage}
      </p>
    );
  }

  if (remaining !== null && remaining <= 10) {
    return (
      <p className={`availability-indicator availability-indicator--low ${className}`.trim()}>
        <i className="bi bi-check-circle-fill me-1" aria-hidden />
        Ne rimangono solo {remaining}
      </p>
    );
  }

  return (
    <p className={`availability-indicator ${className}`.trim()}>
      <i className="bi bi-check-circle-fill me-1" aria-hidden />
      Disponibile
    </p>
  );
}