export const FREE_SHIPPING_THRESHOLD = Number(
  import.meta.env.VITE_FREE_SHIPPING_THRESHOLD ?? 49,
);

export const STANDARD_SHIPPING_COST = Number(
  import.meta.env.VITE_STANDARD_SHIPPING_COST ?? 6.9,
);

export function formatShippingPrice(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return "—";

  return numericValue.toFixed(2).replace(".", ",");
}

export function getRemainingForFreeShipping(total) {
  const numericTotal = Number(total);

  if (Number.isNaN(numericTotal) || numericTotal <= 0) {
    return FREE_SHIPPING_THRESHOLD;
  }

  return Math.max(FREE_SHIPPING_THRESHOLD - numericTotal, 0);
}

export function hasFreeShipping(total) {
  const numericTotal = Number(total);

  if (Number.isNaN(numericTotal)) return false;

  return numericTotal >= FREE_SHIPPING_THRESHOLD;
}

export function getFreeShippingProgress(total) {
  const numericTotal = Number(total);

  if (Number.isNaN(numericTotal) || numericTotal <= 0) return 0;

  return Math.min((numericTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
}
