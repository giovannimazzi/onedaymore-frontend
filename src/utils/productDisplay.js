export function getProductSlugFromLink(productLink) {
  const slugMatch = String(productLink || "").match(/\/products\/([^/?#]+)/);
  return slugMatch ? slugMatch[1] : null;
}

export function formatProductMoney(value) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "—";
  return numericValue.toFixed(2);
}

export function formatProductListPrice(productPrice) {
  const n = Number(productPrice);
  return Number.isFinite(n) ? n.toFixed(2) : String(productPrice ?? "");
}
