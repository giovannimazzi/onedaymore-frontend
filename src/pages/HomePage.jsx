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
            Preparati con prodotti essenziali per <br /> resistere, adattarti e{" "}
            <br />
            continuare ad andare avanti.
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
            <div className="card" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="Cibo"
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">Best seller</span>
                <h5 className="h3 mb-3">€50,00</h5>
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card’s content.
                </p>
                <a href="#" className="btn btn-primary mb-4">
                  Vai al prodotto
                </a>
              </div>
            </div>
            <div className="card ms-5" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">Best seller</span>
                <h5 className="h3 mb-3">€50,00</h5>
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card’s content.
                </p>
                <a href="#" className="btn btn-primary mb-4">
                  Vai al prodotto
                </a>
              </div>
            </div>
            <div className="card ms-5" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">Best seller</span>
                <h5 className="h3 mb-3">€50,00</h5>
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card’s content.
                </p>

                <a href="#" className="btn btn-primary mb-4">
                  Vai al prodotto
                </a>
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
            <div className="card" style={{ width: "20rem" }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="Cibo"
              />
              <div className="card-body">
                <span className="badge bg-success p-2 mb-3">
                  Nuoovo prodotto
                </span>
                <h5 className="h3 mb-3">€50,00</h5>
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card’s content.
                </p>
                <a href="#" className="btn btn-primary mb-4">
                  Vai al prodotto
                </a>
              </div>
            </div>
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
                <h5 className="h3 mb-3">€50,00</h5>
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card’s content.
                </p>
                <a href="#" className="btn btn-primary mb-4">
                  Vai al prodotto
                </a>
              </div>
            </div>
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
                <h5 className="h3 mb-3">€50,00</h5>
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card’s content.
                </p>

                <a href="#" className="btn btn-primary mb-4">
                  Vai al prodotto
                </a>
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
