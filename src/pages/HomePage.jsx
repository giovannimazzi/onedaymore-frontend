export default function HomePage() {
  return (
    <div className=" row flex-lg-row-reverse align-items-center g-5 py-5">
      <div className=" col-10 col-sm-8 col-lg-6">
        <img
          src="https://www.distrettobiologicofiesole.it/wp-content/uploads/2026/02/Newsletter-013_2026.png"
          className=" d-block mx-lg-auto img-fluid rounded"
          alt="Bootstrap Themes"
          width="700"
          height="500"
          loading="lazy"
        />
      </div>
      <div className=" col-lg-6">
        <h1 className="h1 display-5 fw-bold lh-1 mb-3">
          Preparati oggi per ogni domani
        </h1>
        <h2 className="h2 lead display-6 my-4 ">
          Cibo a lunga conservazione per emergenze, viaggi e situazioni
          impreviste.
        </h2>
        <div className=" d-grid gap-2 d-md-flex justify-content-md-start">
          <button
            type="button"
            className=" btn btn-primary btn-lg px-4 me-md-2"
          >
            Scopri i prodotti
          </button>
        </div>
      </div>

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

          <div className="row g-5 py-4 " style={{ placeContent: 'center' }}>
            <div className="card mr-5" style={{ width: '20rem' }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="Cibo"
              />
              <div className="card-body">
                <span class="badge bg-success p-2 mb-3">Best seller</span>
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
            <div className="card ms-5" style={{ width: '20rem' }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <span class="badge bg-success p-2 mb-3">Best seller</span>
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
            <div className="card ms-5" style={{ width: '20rem' }}>
              <img
                src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <span class="badge bg-success p-2 mb-3">Best seller</span>
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
    </div>
  );
}
