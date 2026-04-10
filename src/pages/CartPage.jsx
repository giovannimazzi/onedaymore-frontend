import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { useCartContext } from "../contexts/CartContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import ConfirmDialog from "../components/ConfirmDialog";
import AvailabilityIndicator from "../components/AvailabilityIndicator";
import ProductImage from "../components/ProductImage";
import QtyControls from "../components/QtyControls";
import ShippingInfo from "../components/ShippingInfo";

function formatMoney(value) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "—";
  return numericValue.toFixed(2);
}

const DEMO_PAYMENT_ICONS = [
  { slug: "visa", label: "Visa" },
  { slug: "mastercard", label: "Mastercard" },
  { slug: "americanexpress", label: "American Express" },
  { slug: "paypal", label: "PayPal" },
  { slug: "applepay", label: "Apple Pay" },
  { slug: "klarna", label: "Klarna" },
];

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    restoreCartLine,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    refreshCartAvailability,
  } = useCartContext();
  const { showNotification } = useNotificationContext();

  const [clearCartOpen, setClearCartOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutSyncOpen, setCheckoutSyncOpen] = useState(false);
  const [checkoutSyncMessage, setCheckoutSyncMessage] = useState("");

  const notifyLineRemoved = useCallback(
    (snapshot) => {
      const label =
        (snapshot.name && String(snapshot.name).trim()) || "Prodotto";
      showNotification(`${label} rimosso dal carrello`, "muted", {
        duration: 8000,
        pointer: "cart",
        action: {
          label: "Annulla",
          onAction: () => restoreCartLine(snapshot),
        },
      });
    },
    [showNotification, restoreCartLine],
  );

  const handleDecreaseLine = useCallback(
    (line) => {
      if (line.quantity <= 1) {
        notifyLineRemoved({ ...line });
      }
      decreaseQuantity(line.slug);
    },
    [decreaseQuantity, notifyLineRemoved],
  );

  const handleRemoveLine = useCallback(
    (line) => {
      notifyLineRemoved({ ...line });
      removeFromCart(line.slug);
    },
    [notifyLineRemoved, removeFromCart],
  );

  const handleClearCartConfirm = useCallback(() => {
    clearCart();
    setClearCartOpen(false);
  }, [clearCart]);

  const handleClearCartCancel = useCallback(() => {
    setClearCartOpen(false);
  }, []);

  const handleCheckoutSyncConfirm = useCallback(() => {
    setCheckoutSyncOpen(false);
    navigate("/checkout");
  }, [navigate]);

  const handleCheckoutSyncCancel = useCallback(() => {
    setCheckoutSyncOpen(false);
  }, []);

  useEffect(() => {
    refreshCartAvailability();
  }, [refreshCartAvailability]);

  const handleGoCheckout = useCallback(async () => {
    setCheckoutBusy(true);
    try {
      const result = await refreshCartAvailability({ silent: true });
      if (result === undefined) {
        showNotification(
          "Non è stato possibile verificare le disponibilità. Riprova tra un attimo.",
          "warning",
          { duration: 5200, pointer: "cart" },
        );
        return;
      }
      if (result.changed) {
        const body =
          result.noticeMessage?.trim() ||
          "Il carrello è stato aggiornato in base alla disponibilità attuale.";
        setCheckoutSyncMessage(
          `${body}\n\nControlla le quantità. Puoi continuare al checkout oppure chiudere e rivedere il carrello.`,
        );
        setCheckoutSyncOpen(true);
        return;
      }
      navigate("/checkout");
    } finally {
      setCheckoutBusy(false);
    }
  }, [navigate, refreshCartAvailability, showNotification]);

  const total = cart.reduce(
    (runningTotal, line) => runningTotal + line.price * (line.quantity || 1),
    0,
  );

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <h2 className="text-center">Carrello vuoto</h2>
        <p className="text-center mt-3">
          <Link to="/products" className="btn btn-primary">
            Vai ai prodotti
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container cart-page py-4 py-lg-5">
      <header className="cart-page-header d-flex flex-wrap align-items-center mb-3 mb-lg-4">
        <h1 className="mb-0">Carrello</h1>
        <button
          type="button"
          className="btn btn-outline-danger btn-sm cart-clear-all-btn flex-shrink-0"
          onClick={() => setClearCartOpen(true)}
        >
          Svuota carrello
        </button>
      </header>

      <ConfirmDialog
        open={clearCartOpen}
        title="Svuotare il carrello?"
        message="Tutti gli articoli verranno rimossi. Puoi annullare e tornare indietro."
        confirmLabel="Svuota carrello"
        cancelLabel="Annulla"
        confirmVariant="danger"
        onConfirm={handleClearCartConfirm}
        onCancel={handleClearCartCancel}
      />

      <ConfirmDialog
        open={checkoutSyncOpen}
        title="Carrello aggiornato"
        message={checkoutSyncMessage}
        confirmLabel="Vai al checkout"
        cancelLabel="Annulla"
        confirmVariant="primary"
        onConfirm={handleCheckoutSyncConfirm}
        onCancel={handleCheckoutSyncCancel}
      />

      <div className="row g-4">
        <div className="col-lg-8 order-2 order-lg-1">
          {cart.map((line) => (
            <div key={line.slug} className="cart-line-card mb-3">
              <div className="cart-line-inner">
                <div className="cart-line-media">
                  <div className="cart-line-thumb">
                    <ProductImage
                      src={line.image_url}
                      categorySlug={line.category_slug}
                      alt={line.name}
                      className="cart-line-image"
                    />
                  </div>
                </div>
                <div className="cart-line-main">
                  <div className="row align-items-center g-3 cart-line-body-row">
                    <div className="col-12 col-lg-7">
                      <div className="cart-line-name">
                        <Link to={`/products/${line.slug}`}>{line.name}</Link>
                      </div>

                      <AvailabilityIndicator
                        slug={line.slug}
                        quantityAvailable={line.quantity_available}
                        showWhenAvailable={true}
                        className="cart-line-availability mb-2 mt-0"
                      />

                      <div className="cart-line-actions">
                        <QtyControls
                          quantity={line.quantity}
                          quantityAvailable={line.quantity_available}
                          onIncrease={() => increaseQuantity(line.slug)}
                          onDecrease={() => handleDecreaseLine(line)}
                          className="cart-line-quantity-controls"
                          trashWhenLast
                        />

                        <button
                          type="button"
                          className="btn btn-link cart-remove-link"
                          onClick={() => handleRemoveLine(line)}
                        >
                          Rimuovi
                        </button>
                      </div>
                    </div>

                    <div className="col-12 col-lg-5 cart-line-col-price">
                      <p className="cart-line-price mb-0">
                        €{formatMoney(line.price * line.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4 order-1 order-lg-2">
          <div className="cart-summary-sticky">
            <div className="cart-summary-card">
              <h2>Riepilogo</h2>
              <p className="cart-summary-total mb-0">€{formatMoney(total)}</p>
              <p className="small mb-4 text-dim">
                {cart.reduce((count, line) => count + line.quantity, 0)}{" "}
                articoli nel carrello
              </p>

              <ShippingInfo cartTotal={total} className="mb-4" />

              <Link to="/products" className="cart-link">
                <small>Aggiungi altri articoli</small>
              </Link>

              <button
                type="button"
                className="btn btn-primary w-100 mt-2"
                disabled={checkoutBusy}
                onClick={handleGoCheckout}
              >
                {checkoutBusy ? "Verifica in corso…" : "Vai al Checkout"}
              </button>

              <div className="cart-payment-methods">
                <p className="cart-payment-methods-title">
                  Pagamenti accettati{" "}
                  <span className="text-uppercase">(demo)</span>
                </p>
                <ul className="cart-payment-methods-list" role="list">
                  {DEMO_PAYMENT_ICONS.map(({ slug, label }) => (
                    <li key={slug}>
                      <img
                        src={`https://cdn.simpleicons.org/${slug}/e2ddd0`}
                        alt={label}
                        width={44}
                        height={28}
                        loading="lazy"
                        decoding="async"
                        className="cart-payment-methods-icon"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
