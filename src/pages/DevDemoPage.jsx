import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import {
  devDemoStateEndpoint,
  devDemoPaymentModeEndpoint,
  devDemoStockEndpoint,
  devDemoResetEndpoint,
} from "../utils/api";

const DEMO_PRODUCT_SLUG = "scorta-acqua-potabile-20l";

function sectionClassNames(borderClass) {
  return `card shadow-sm mb-4 ${borderClass}`;
}

export default function DevDemoPage() {
  const [demoState, setDemoState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function fetchState() {
    setErrorMessage("");

    axios
      .get(devDemoStateEndpoint)
      .then((res) => {
        setDemoState(res.data.result);
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(
          "Impossibile caricare il pannello demo. Verifica che backend e modalità dev siano attivi.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchState();
  }, []);

  function handlePaymentModeChange(mode) {
    setIsActionLoading(true);
    setErrorMessage("");

    axios
      .post(devDemoPaymentModeEndpoint, { mode })
      .then(() => {
        fetchState();
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage(
          "Errore durante l'aggiornamento della modalità pagamento.",
        );
      })
      .finally(() => {
        setIsActionLoading(false);
      });
  }

  function handleSetStock(quantityAvailable) {
    setIsActionLoading(true);
    setErrorMessage("");

    axios
      .post(devDemoStockEndpoint, {
        slug: DEMO_PRODUCT_SLUG,
        quantity_available: quantityAvailable,
      })
      .then(() => {
        fetchState();
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Errore durante l'aggiornamento dello stock demo.");
      })
      .finally(() => {
        setIsActionLoading(false);
      });
  }

  function handleResetDemo() {
    setIsActionLoading(true);
    setErrorMessage("");

    axios
      .post(devDemoResetEndpoint)
      .then(() => {
        fetchState();
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage("Errore durante il reset della demo.");
      })
      .finally(() => {
        setIsActionLoading(false);
      });
  }

  if (!import.meta.env.DEV) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger mb-0">
          Questa pagina è disponibile solo in ambiente di sviluppo.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="mb-1">Pannello demo presentazione</h1>
          <p className="text-muted mb-0">
            Pagina interna per scaletta, dati e simulazioni.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={fetchState}
            disabled={isLoading || isActionLoading}
          >
            Aggiorna stato
          </button>

          <button
            type="button"
            className="btn btn-dark"
            onClick={handleResetDemo}
            disabled={isLoading || isActionLoading}
          >
            Reset demo
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="card shadow-sm mb-4 border-secondary">
        <div className="card-body">
          <h2 className="h4 mb-3 text-info">Regia</h2>

          <div className="row g-4">
            <div className="col-12 col-xl-6">
              <h3 className="h6 text-uppercase text-light">Pagamento</h3>
              <p className="mb-2">
                Stato attuale: <strong>{demoState?.payment_mode || "—"}</strong>
              </p>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => handlePaymentModeChange("default")}
                  disabled={isLoading || isActionLoading}
                >
                  Default
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => handlePaymentModeChange("always_success")}
                  disabled={isLoading || isActionLoading}
                >
                  Always success
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handlePaymentModeChange("always_fail")}
                  disabled={isLoading || isActionLoading}
                >
                  Always fail
                </button>
              </div>
            </div>

            <div className="col-12 col-xl-6">
              <h3 className="h6 text-uppercase text-light">Stock rapido</h3>
              <p className="mb-2">
                Prodotto demo: <strong>{DEMO_PRODUCT_SLUG}</strong>
              </p>

              <div className="d-flex flex-wrap gap-2">
                {[0, 1, 10, 15].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => handleSetStock(qty)}
                    disabled={isLoading || isActionLoading}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={sectionClassNames("border-primary")}>
        <div className="card-body">
          <h2 className="h4 text-primary">🔵 Sezione 1 — Catalogo / Ricerca</h2>
          <ol className="mb-3">
            <li>Aprire homepage</li>
            <li>Andare nel catalogo</li>
            <li>Cercare “acqua”</li>
            <li>Cambiare visualizzazione griglia/lista</li>
            <li>Applicare filtro quantità minima 5</li>
          </ol>
          <p className="mb-3">
            <strong>Responsive:</strong> homepage e catalogo
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-primary" to="/">
              Homepage
            </Link>
            <Link className="btn btn-outline-primary" to="/products">
              Catalogo
            </Link>
          </div>
        </div>
      </div>

      <div className={sectionClassNames("border-success")}>
        <div className="card-body">
          <h2 className="h4 text-success">
            🟢 Sezione 2 — Carrello / Spedizione
          </h2>
          <ol className="mb-3">
            <li>Aggiungere acqua 20L + acqua 5L</li>
            <li>Mostrare carrello sotto soglia</li>
            <li>Aggiungere altro prodotto e superare 49€</li>
            <li>Mostrare spedizione gratuita</li>
            <li>Impostare stock demo a 1</li>
          </ol>
          <p className="mb-3">
            <strong>Responsive:</strong> carrello
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-success" to="/cart">
              Carrello
            </Link>
          </div>
        </div>
      </div>

      <div className={sectionClassNames("border-info")}>
        <div className="card-body">
          <h2 className="h4 text-info">🟣 Sezione 3 — Confronto</h2>
          <ol className="mb-3">
            <li>Aprire la pagina confronto vuota</li>
            <li>Mostrare empty state</li>
            <li>Aggiungere prodotti al confronto</li>
            <li>Mostrare confronto completo</li>
          </ol>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-info text-white" to="/compare">
              Vai al confronto
            </Link>
          </div>
        </div>
      </div>

      <div className={sectionClassNames("border-warning")}>
        <div className="card-body">
          <h2 className="h4 text-warning">
            🟡 Sezione 4 — Checkout / Validazioni
          </h2>

          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <h3 className="h6 text-uppercase text-light">Dati validi</h3>
              <div className="bg-black rounded p-3 small">
                <div>Mario</div>
                <div>Rossi</div>
                <div>mario.rossi@example.com</div>
                <div>3331234567</div>
                <div>Via Roma 10</div>
                <div>Milano</div>
                <div>20100</div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <h3 className="h6 text-uppercase text-light">Dati invalidi</h3>
              <div className="bg-black rounded p-3 small">
                <div>email: mario.rossi</div>
                <div>telefono: abc123</div>
              </div>
            </div>
          </div>

          <ol className="mb-3 mt-3">
            <li>Aprire checkout</li>
            <li>Inserire dati validi</li>
            <li>Mostrare errore con un dato invalido</li>
            <li>Impostare stock demo a 0</li>
            <li>Provare a completare l’ordine</li>
          </ol>

          <p className="mb-3">
            <strong>Responsive:</strong> checkout
          </p>

          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-warning" to="/checkout">
              Vai al checkout
            </Link>
          </div>
        </div>
      </div>

      <div className={sectionClassNames("border-danger")}>
        <div className="card-body">
          <h2 className="h4 text-danger">
            🔴 Sezione 5 — Pagamento / Codici / 404
          </h2>

          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <h3 className="h6 text-uppercase text-light">Codici sconto</h3>
              <ul className="mb-0">
                <li>LAUNCH10 → attivo</li>
                <li>APRILE6 → minimo 59€</li>
                <li>BLACK15 → non ancora attivo</li>
              </ul>
            </div>

            <div className="col-12 col-lg-6">
              <h3 className="h6 text-uppercase text-light">Passi</h3>
              <ol className="mb-0">
                <li>Applicare LAUNCH10</li>
                <li>Provare BLACK15</li>
                <li>Forzare pagamento fail</li>
                <li>Forzare pagamento success</li>
                <li>Aprire pagina 404</li>
              </ol>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <Link
              className="btn btn-outline-danger"
              to="/pagina-che-non-esiste"
            >
              Apri 404
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
