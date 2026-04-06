export function getProductBadges(product) {
  const badges = [];
  if (product?.is_best_seller) badges.push({ text: "Best seller", variant: "gold" });
  if (product?.is_latest) badges.push({ text: "Nuovo arrivo", variant: "latest" });
  return badges;
}

export function badgeClass(variant) {
  if (variant === "gold") return " card-badge--gold";
  if (variant === "latest") return " card-badge--latest";
  return "";
}
