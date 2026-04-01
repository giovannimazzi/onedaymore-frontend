import { Link } from "react-router";

export default function HomePage() {
  return (
    <>
      <section className="hero d-flex flex-column justify-content-between align-items-start">
        <div>
          <h1>
            Quando tutto crolla <br /> resta ciò che sei.
          </h1>
          <p className="fs-5">
            Siamo quello che mangiamo. <br />
            Preparati con prodotti essenziali per <br /> resistere, adattarti e
            continuare <br />
            ad andare avanti.
          </p>
        </div>
        <button className="btn btn-primary">Call To Action</button>
      </section>

      <div className="mt-5">
        <div className="container">
          <div className="row">
            <div>
              <h2 className="h1 text-center">Prodotti più venduti</h2>
              <p className="text-center fs-3">
                le soluzioni più apprezzate per prepararsi agli imprevisti
              </p>
            </div>
          </div>

          <div className="row g-5 py-4 " style={{ placeContent: "center" }}>
            {/* PRODOTTO 1 */}
            <div className="card" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="Cibo"
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">Best seller</span>
                <h5 className="h3 mb-3">€50,00</h5>
                <h5 className="card-title">Kit Sopravvivenza Base</h5>
                <p className="card-text">
                  Kit essenziale per affrontare emergenze di base.
                </p>
                <Link to="/products/1" className="btn btn-primary mb-4">
                  Vai al prodotto
                </Link>
              </div>
            </div>

            {/* PRODOTTO 2 */}
            <div className="card ms-5" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">Best seller</span>
                <h5 className="h3 mb-3">€80,00</h5>
                <h5 className="card-title">Kit Avanzato</h5>
                <p className="card-text">
                  Più completo per affrontare situazioni difficili.
                </p>
                <Link to="/products/2" className="btn btn-primary mb-4">
                  Vai al prodotto
                </Link>
              </div>
            </div>

            {/* PRODOTTO 3 */}
            <div className="card ms-5" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">Best seller</span>
                <h5 className="h3 mb-3">€120,00</h5>
                <h5 className="card-title">Kit Estremo</h5>
                <p className="card-text">
                  Per sopravvivere anche nelle condizioni più estreme.
                </p>
                <Link to="/products/3" className="btn btn-primary mb-4">
                  Vai al prodotto
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-success text-center py-3" type="button">
              Visualizza tutti i prodotti
            </button>
          </div>
        </div>
      </div>

      {/* NUOVI ARRIVI */}
      <div className="mt-5 py-5 bg-success full-width">
        <div className="container ">
          <div className="row">
            <div className="text-light">
              <h2 className="h1 text-center">Nuovi arrivi</h2>
              <p className="text-center fs-3">
                Appena arrivati, pronti per ogni domani
              </p>
            </div>
          </div>

          <div className="row g-5 py-4 " style={{ placeContent: "center" }}>
            {/* PRODOTTO 4 */}
            <div className="card" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="Cibo"
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">
                  Nuovo prodotto
                </span>
                <h5 className="h3 mb-3">€60,00</h5>
                <h5 className="card-title">Kit Fresh Start</h5>
                <p className="card-text">
                  Nuova soluzione per iniziare a prepararsi.
                </p>
                <Link to="/products/4" className="btn btn-primary mb-4">
                  Vai al prodotto
                </Link>
              </div>
            </div>

            {/* PRODOTTO 5 */}
            <div className="card ms-5" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">
                  Nuovo prodotto
                </span>
                <h5 className="h3 mb-3">€90,00</h5>
                <h5 className="card-title">Kit Survival Pro</h5>
                <p className="card-text">Pensato per utenti più esperti.</p>
                <Link to="/products/5" className="btn btn-primary mb-4">
                  Vai al prodotto
                </Link>
              </div>
            </div>

            {/* PRODOTTO 6 */}
            <div className="card ms-5" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">
                  Nuovo prodotto
                </span>
                <h5 className="h3 mb-3">€150,00</h5>
                <h5 className="card-title">Kit Apocalypse</h5>
                <p className="card-text">
                  Il massimo per ogni scenario estremo.
                </p>
                <Link to="/products/6" className="btn btn-primary mb-4">
                  Vai al prodotto
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-dark text-center py-3" type="button">
              Visualizza tutti i prodotti
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
