const CATEGORY_FALLBACK_IMAGES = {
  "pasti-liofilizzati": "/pasti-liofilizzati.png",
  "colazioni-e-snack": "/colazioni-e-snack.png",
  "razioni-alta-densita-calorica": "/razioni-alta-densita-calorica.png",
  "bevande-e-reintegro": "/bevande-e-reintegro.png",
};

const GENERIC_FALLBACK_IMAGE = "/pasti-liofilizzati.png";

export function getCategoryFallbackImage(categorySlug) {
  return CATEGORY_FALLBACK_IMAGES[categorySlug] || GENERIC_FALLBACK_IMAGE;
}
