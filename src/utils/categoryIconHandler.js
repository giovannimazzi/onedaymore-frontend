const ICON_BY_SLUG = {
  "pasti-liofilizzati": "bi-box-seam",
  "colazioni-e-snack": "bi-cup-hot",
  "razioni-alta-densita-calorica": "bi-lightning-charge",
  "bevande-e-reintegro": "bi-cup-straw",
};

export function categoryIconHandler(categorySlug) {
  return ICON_BY_SLUG[categorySlug] ?? "bi-question-diamond-fill";
}