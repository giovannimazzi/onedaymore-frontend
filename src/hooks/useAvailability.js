export function useAvailability(quantityAvailable, quantityInCart = 0) {
  const remaining =
    quantityAvailable != null ? quantityAvailable - quantityInCart : null;

  const isOutOfStock = remaining !== null && remaining <= 0;
  const isLowStock = remaining !== null && remaining > 0 && remaining <= 10;
  const canAddMore = remaining === null || remaining > 0;

  return { remaining, isOutOfStock, isLowStock, canAddMore };
}
