import { Link, NavLink, Outlet } from "react-router";
import { useLoaderContext } from "../contexts/LoaderContext";
import { useNotificationContext } from "../contexts/NotificationContext";

export default function DefaultLayout() {
  const { isLoading } = useLoaderContext();
  const { notification, hideNotification } = useNotificationContext();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">
            OneDay<span style={{ color: "var(--odm-gold)" }}>More</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
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
        </div>
      </nav>

      <main>
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
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={() => {
                setTimeout(hideNotification, 800);
              }}
            ></button>
          </div>
        )}

        <Outlet />
      </main>
      <footer className="bg-dark text-light py-4">
        <div className="text-center">
          {/* BRAND */}
          <h5 className="fw-bold mb-2">OneDayMore</h5>

          <p className="mb-3 small">Un giorno in più. Sempre.</p>

          {/* SOCIAL */}
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

          {/* CONTATTI */}
          <p className="small mb-2 text-secondary">
            Via Appia Nuova 742, 00179 Roma (RM)
          </p>
          <p className="small mb-3 text-secondary">
            Tel: +39 06 9876 5432 · info@onedaymore.it
          </p>

          {/* COPYRIGHT */}
          <small className="d-block text-secondary">
            © {new Date().getFullYear()} OneDayMore · Tutti i diritti riservati
          </small>

          <small className="d-block text-secondary">
            Crafted by <span className="fw-semibold text-light">Last Byte</span>
          </small>
        </div>
      </footer>
    </>
  );
}
