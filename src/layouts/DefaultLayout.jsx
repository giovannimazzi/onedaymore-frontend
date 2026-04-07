import { Link, NavLink, Outlet } from "react-router";
import { useLoaderContext } from "../contexts/LoaderContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useCartContext } from "../contexts/CartContext";
import ShippingInfo from "../components/ShippingInfo";

export default function DefaultLayout() {
  const { isLoading } = useLoaderContext();
  const { notification, hideNotification } = useNotificationContext();
  const { cart } = useCartContext();

  const cartTotal = cart.reduce(
    (sum, line) => sum + line.price * (line.quantity || 1),
    0,
  );

  const cartItemCount = cart.reduce(
    (total, line) => total + (line.quantity || 1),
    0,
  );

  return (
    <div className="odm-layout">
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark odm-navbar">
        <div className="container-fluid odm-navbar-inner d-flex flex-wrap align-items-stretch px-0">
          <Link
            to="/"
            className="navbar-brand align-self-center ps-3 ps-lg-4 flex-shrink-0"
          >
            OneDay<span className="odm-brand-gold">More</span>
          </Link>
          <button
            className="navbar-toggler align-self-center ms-auto me-2 d-lg-none flex-shrink-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse odm-navbar-collapse flex-lg-grow-1"
            id="navbarNav"
          >
            <ul className="navbar-nav ms-lg-auto align-items-lg-center pe-lg-2">
              <li className="nav-item w-100 mt-auto mb-2 me-5 list-unstyled">
                <ShippingInfo cartTotal={cartTotal} />
              </li>
              <li className="nav-item ms-5">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/products" className="nav-link">
                  Prodotti
                </NavLink>
              </li>
            </ul>
          </div>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `nav-link navbar-cart-link navbar-cart-link--edge${isActive ? " active" : ""}`
            }
            aria-label={`Carrello${cartItemCount > 0 ? `, ${cartItemCount} articoli` : ""}`}
          >
            <span className="navbar-cart-icon-wrap">
              <i className="bi bi-cart3 navbar-cart-icon" aria-hidden />
            </span>
            {cartItemCount > 0 && (
              <span className="navbar-cart-badge">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </NavLink>
        </div>
      </nav>

      <main className="odm-layout-main">
        {isLoading && (
          <div className="overlay-loading">
            <p>Caricamento...</p>
          </div>
        )}

        {notification.visible && (
          <div
            className={`alert alert-${notification.type} alert-dismissible fade show mb-4`}
            role="alert"
          >
            {notification.message}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={hideNotification}
            ></button>
          </div>
        )}

        <Outlet />
      </main>
      <footer className="bg-dark text-light py-4">
        <div className="container">
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <div className="text-center">
              <h5 className="site-footer-brand mb-2">
                OneDay<span className="odm-brand-gold">More</span>
              </h5>

              <p className="mb-3 small">Un giorno in più. Sempre.</p>

              <div className="mb-3">
                <a href="#" className="text-light mx-2 fs-5">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-light mx-2 fs-5">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-light mx-2 fs-5">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#" className="text-light mx-2 fs-5">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>

              <p className="small mb-2 text-secondary">
                Via Appia Nuova 742, 00179 Roma (RM)
              </p>
              <p className="small mb-3 text-secondary">
                Tel: +39 06 9876 5432 · info@onedaymore.it
              </p>

              <small className="d-block text-secondary">
                © {new Date().getFullYear()} OneDayMore · Tutti i diritti
                riservati
              </small>

              <small className="site-footer-crafted text-secondary">
                <span>Crafted by</span>
                <img
                  src="/team-logo.webp"
                  alt=""
                  className="site-footer-team-logo"
                />
                <span className="fw-semibold text-light">Last Byte</span>
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
