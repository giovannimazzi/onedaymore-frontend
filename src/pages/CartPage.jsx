import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { useCartContext } from "../contexts/CartContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import ConfirmDialog from "../components/ConfirmDialog";
import ProductRow from "../components/ProductRow";
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
  const { cart, clearCart, refreshCartAvailability } = useCartContext();
  const { showNotification } = useNotificationContext();

  const [clearCartOpen, setClearCartOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutSyncOpen, setCheckoutSyncOpen] = useState(false);
  const [checkoutSyncMessage, setCheckoutSyncMessage] = useState("");

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

  const articleCount = cart.reduce((n, line) => n + line.quantity, 0);

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
      <div className="row g-4 cart-page-header-row mb-3 mb-lg-4">
        <div className="col-12 col-lg-8">
          <header className="cart-page-header">
            <div className="cart-page-header-inner">
              <div className="cart-page-header-row d-flex flex-wrap align-items-center justify-content-between column-gap-3 row-gap-2">
                <h1 className="cart-page-header-title mb-0">Carrello</h1>
                <div className="cart-page-header-actions">
                  <p className="cart-page-header-meta mb-0" role="status">
                    {articleCount === 1
                      ? "1 articolo"
                      : `${articleCount} articoli`}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm cart-clear-all-btn flex-shrink-0"
                    onClick={() => setClearCartOpen(true)}
                  >
                    Svuota carrello
                  </button>
                </div>
              </div>
            </div>
          </header>
        </div>
        <div
          className="col-lg-4 d-none d-lg-block cart-page-header-grid-spacer"
          aria-hidden="true"
        />
      </div>

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
            <ProductRow key={line.slug} className="mb-3" line={line} />
          ))}
        </div>

        <div className="col-lg-4 order-1 order-lg-2">
          <div className="cart-summary-sticky">
            <div className="cart-summary-card">
              <h2>Riepilogo</h2>
              <p className="cart-summary-total mb-0">€{formatMoney(total)}</p>
              <p className="small mb-4 text-dim">
                {articleCount}{" "}
                {articleCount === 1
                  ? "articolo nel carrello"
                  : "articoli nel carrello"}
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
