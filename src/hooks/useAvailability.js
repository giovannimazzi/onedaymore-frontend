export function useAvailability(quantityAvailable, quantityInCart = 0) {
  const stock =
    quantityAvailable != null ? Number(quantityAvailable) : null;
  const inCart = Number(quantityInCart) || 0;

  const remaining = stock != null ? stock - inCart : null;

  const isWarehouseEmpty = stock != null && stock <= 0;
  const isCartLimitReached =
    stock != null && stock > 0 && remaining !== null && remaining <= 0;

  const isOutOfStock = remaining !== null && remaining <= 0;
  const isLowStock = remaining !== null && remaining > 0 && remaining <= 10;
  const canAddMore = remaining === null || remaining > 0;

  return {
    remaining,
    isOutOfStock,
    isLowStock,
    canAddMore,
    isWarehouseEmpty,
    isCartLimitReached,
  };
}
