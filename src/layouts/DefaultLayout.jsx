import { Link, NavLink, Outlet } from "react-router";
import { useLoaderContext } from "../contexts/LoaderContext";
import { useNotificationContext } from "../contexts/NotificationContext";

export default function DefaultLayout() {
  const { isLoading } = useLoaderContext();
  const { notification, hideNotification } = useNotificationContext();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
          <Link to="/" className="navbar-brand">
            OneDayMore
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
              <li className="nav-item">
                <NavLink to="/cart" className="nav-link">
                  Carrello
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
    </>
  );
}
