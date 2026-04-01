import ProductCard from "../components/ProductCard";

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

          <div
            className="row row-cols-3 g-5 py-4"
            style={{ placeContent: "center" }}
          >
            <ProductCard
              productName={"Nome Prodotto"}
              productPrice={"50€"}
              productShortDescr={"Descrizione prodotto"}
              badgeText={"Best Seller"}
            />
            <ProductCard
              productName={"Nome Prodotto"}
              productPrice={"50€"}
              productShortDescr={"Descrizione prodotto"}
              badgeText={"Best Seller"}
            />
            <ProductCard
              productName={"Nome Prodotto"}
              productPrice={"50€"}
              productShortDescr={"Descrizione prodotto"}
              badgeText={"Best Seller"}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-success text-center py-3" type="button">
              Visualizza tutti i prodotti
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 py-5 bg-success">
        <div className="container ">
          <div className="row">
            <div className="text-light">
              <h2 className="h1 text-center">Nuovi arrivi</h2>
              <p className="text-center fs-3">
                Appena arrivati, pronti per ogni domani
              </p>
            </div>
          </div>

          <div
            className="row row-cols-3 g-5 py-4 "
            style={{ placeContent: "center" }}
          >
            <ProductCard
              productName={"Nome Prodotto"}
              productPrice={"50€"}
              productShortDescr={"Descrizione prodotto"}
              badgeText={"Nuovo Prodotto"}
            />
            <ProductCard
              productName={"Nome Prodotto"}
              productPrice={"50€"}
              productShortDescr={"Descrizione prodotto"}
              badgeText={"Nuovo Prodotto"}
            />
            <ProductCard
              productName={"Nome Prodotto"}
              productPrice={"50€"}
              productShortDescr={"Descrizione prodotto"}
              badgeText={"Nuovo Prodotto"}
            />
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
