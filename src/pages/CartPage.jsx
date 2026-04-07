import { Link } from "react-router";
import { useCartContext } from "../contexts/CartContext";
import AvailabilityIndicator from "../components/AvailabilityIndicator";
import ProductImage from "../components/ProductImage";
import QtyControls from "../components/QtyControls";

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
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCartContext();

  const total = cart.reduce(
    (runningTotal, line) => runningTotal + line.price * line.quantity,
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
      <h1>Carrello</h1>

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
                        remaining={
                          line.quantity_available != null
                            ? line.quantity_available - line.quantity
                            : null
                        }
                        showWhenAvailable={false}
                        className="cart-line-availability mb-2 mt-0"
                      />

                      <div className="cart-line-actions">
                        <QtyControls
                          quantity={line.quantity}
                          quantityAvailable={line.quantity_available}
                          onIncrease={() => increaseQuantity(line.slug)}
                          onDecrease={() => decreaseQuantity(line.slug)}
                          className="cart-line-quantity-controls"
                        />

                        <button
                          type="button"
                          className="btn btn-link cart-remove-link"
                          onClick={() => removeFromCart(line.slug)}
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
                {cart.reduce((count, line) => count + line.quantity, 0)} articoli nel carrello
              </p>
              <button type="button" className="btn btn-primary w-100">
                Completa il pagamento
              </button>

              <div className="cart-payment-methods">
                <p className="cart-payment-methods-title">
                  Pagamenti accettati <span className="text-uppercase">(demo)</span>
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
