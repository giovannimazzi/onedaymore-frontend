import { useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useLoaderContext } from "../contexts/LoaderContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useCartContext } from "../contexts/CartContext";
import { useCompareContext } from "../contexts/CompareContext";

const TOAST_MIN_TOP_PX = 8;

export default function DefaultLayout() {
  const { isLoading } = useLoaderContext();
  const { notification, hideNotification } = useNotificationContext();
  const { cart } = useCartContext();
  const { compareItems } = useCompareContext();
  const navRef = useRef(null);
  const toastRef = useRef(null);
  const [toastTopPx, setToastTopPx] = useState(TOAST_MIN_TOP_PX);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const compareCount = compareItems.length;

  const cartItemCount = cart.reduce(
    (total, line) => total + (line.quantity || 1),
    0,
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useLayoutEffect(() => {
    if (!notification.visible) return undefined;

    const nav = navRef.current;
    if (!nav) return undefined;

    const updateLayout = () => {
      const bottom = nav.getBoundingClientRect().bottom;
      setToastTopPx(Math.max(TOAST_MIN_TOP_PX, bottom));

      const toast = toastRef.current;
      const pointer = notification.pointer;

      if (!toast || !pointer) {
        if (toast) toast.style.removeProperty("--odm-toast-pointer-x");
        return;
      }

      const target = nav.querySelector(`[data-odm-nav-anchor="${pointer}"]`);
      if (!target) {
        toast.style.removeProperty("--odm-toast-pointer-x");
        return;
      }

      const t = target.getBoundingClientRect();
      const tr = toast.getBoundingClientRect();
      const cx = t.left + t.width / 2;
      let x = cx - tr.left;
      const pad = 14;
      x = Math.min(Math.max(pad, x), tr.width - pad);
      toast.style.setProperty("--odm-toast-pointer-x", `${x}px`);
    };

    updateLayout();

    window.addEventListener("scroll", updateLayout, { passive: true });
    window.addEventListener("resize", updateLayout);

    const ro = new ResizeObserver(updateLayout);
    ro.observe(nav);
    const toastEl = toastRef.current;
    if (toastEl) ro.observe(toastEl);

    return () => {
      window.removeEventListener("scroll", updateLayout);
      window.removeEventListener("resize", updateLayout);
      ro.disconnect();
    };
  }, [
    notification.visible,
    notification.pointer,
    notification.seq,
    compareCount,
    cartItemCount,
  ]);

  useLayoutEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="odm-layout">
      <nav
        ref={navRef}
        className="navbar navbar-expand-lg bg-dark navbar-dark odm-navbar"
      >
        <div className="container-fluid odm-navbar-inner d-flex flex-wrap align-items-stretch px-0">
          <Link
            to="/"
            className="navbar-brand align-self-center ps-3 ps-lg-4 flex-shrink-0 order-1"
          >
            OneDay<span className="odm-brand-gold">More</span>
          </Link>
          <div className="odm-navbar-trailing-tools d-flex align-items-center ms-auto ms-lg-0 flex-shrink-0 gap-2 pe-2 order-2 order-lg-3">
            <NavLink
              to="/cart"
              data-odm-nav-anchor="cart"
              className={({ isActive }) =>
                `nav-link navbar-cart-link navbar-cart-link--edge${isActive ? " active" : ""}`
              }
              aria-label={`Carrello${cartItemCount > 0 ? `, ${cartItemCount} articoli` : ""}`}
            >
              <span className="navbar-cart-icon-wrap">
                <i className="bi bi-cart3 navbar-cart-icon" aria-hidden />
              </span>
              {cartItemCount > 0 && (
                <span className="odm-nav-count-badge odm-nav-count-badge--cart">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </NavLink>
            <button
              className="navbar-toggler odm-navbar-toggler d-lg-none flex-shrink-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Apri o chiudi il menu"
            >
              <i className="bi bi-list odm-navbar-toggler-icon" aria-hidden />
            </button>
          </div>
          <div
            className="collapse navbar-collapse odm-navbar-collapse flex-lg-grow-1 order-3 order-lg-2"
            id="navbarNav"
          >
            <ul className="navbar-nav ms-lg-auto align-items-lg-center pe-lg-2">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className="nav-link d-inline-flex align-items-center gap-1 gap-lg-2"
                >
                  <i
                    className="bi bi-house-door odm-nav-link-icon"
                    aria-hidden
                  />
                  <span>Home</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/products"
                  className="nav-link d-inline-flex align-items-center gap-1 gap-lg-2"
                >
                  <i
                    className="bi bi-grid-3x3-gap odm-nav-link-icon"
                    aria-hidden
                  />
                  <span>Prodotti</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/compare"
                  className="nav-link d-inline-flex align-items-center gap-1 gap-lg-2 odm-nav-compare-link"
                  data-odm-nav-anchor="compare"
                >
                  <span className="odm-nav-compare-icon-wrap">
                    <i
                      className="odm-nav-link-icon bi bi-arrow-left-right"
                      aria-hidden
                    />
                  </span>
                  <span>Confronta</span>
                  {compareCount > 0 && (
                    <span className="odm-nav-count-badge odm-nav-count-badge--compare">
                      {compareCount}
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {notification.visible && (
        <div
          key={notification.seq}
          ref={toastRef}
          className={`odm-toast odm-toast--fixed-nav odm-toast--${notification.type} alert-dismissible fade show${notification.pointer ? " odm-toast--with-tail" : ""}${notification.action ? " odm-toast--has-action" : ""}`}
          style={{ top: toastTopPx }}
          role="alert"
        >
          <span className="odm-toast-message">{notification.message}</span>
          {notification.action ? (
            <button
              type="button"
              className="odm-toast-action-btn"
              onClick={() => {
                notification.action.onAction();
                hideNotification();
              }}
            >
              {notification.action.label}
            </button>
          ) : null}
          <button
            type="button"
            className="btn-close"
            aria-label="Chiudi"
            onClick={hideNotification}
          />
        </div>
      )}
      <main className="odm-layout-main">
        {isLoading && (
          <div className="overlay-loading">
            <p>Caricamento...</p>
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
                  alt="Last Byte"
                  className="site-footer-team-logo"
                />
              </small>
            </div>
          </div>
        </div>
      </footer>
      {showScrollTop && (
        <button
          className="odm-scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Torna in alto"
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}
    </div>
  );
}
