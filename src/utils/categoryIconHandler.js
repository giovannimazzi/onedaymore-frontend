export function categoryIconHandler(categoryId) {
  const iconMap = {
    1: "bi-box-seam", // Pasti Liofilizzati
    2: "bi-cup-hot", // Colazioni e Snack
    3: "bi-lightning-charge", // Alta densità calorica
    4: "bi-cup-straw", // Bevande e reintegro
  };

  return iconMap[categoryId] || "bi-question-diamond-fill";
}
