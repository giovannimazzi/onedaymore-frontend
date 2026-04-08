import { useCompareContext } from "../contexts/CompareContext";
import { useNotificationContext } from "../contexts/NotificationContext";

export default function CompareToggleButton({
  product,
  className = "",
  fullWidth = false,
}) {
  const { toggleCompare, isInCompare, isCompareFull } = useCompareContext();
  const { showNotification } = useNotificationContext();

  const inCompare = isInCompare(product.slug);
  const isCompareLocked = !inCompare && isCompareFull;

  const handleClick = () => {
    if (isCompareLocked) {
      showNotification("Puoi confrontare al massimo 3 prodotti", "warning");
      return;
    }

    toggleCompare(product);

    showNotification(
      inCompare
        ? "Prodotto rimosso dal confronto"
        : "Prodotto aggiunto al confronto",
      "success",
    );
  };

  return (
    <button
      type="button"
      className={`btn btn-outline-secondary ${fullWidth ? "w-100" : ""} ${className} ${isCompareLocked ? "text-muted bg-secondary" : ""}`.trim()}
      onClick={handleClick}
      aria-disabled={isCompareLocked}
    >
      {inCompare ? "Rimuovi dal confronto" : "Confronta"}
    </button>
  );
}
