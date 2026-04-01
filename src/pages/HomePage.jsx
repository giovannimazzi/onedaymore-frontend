import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";

const OneDayMoreProductsEndpoint = "http://localhost:3000/products";
const homepageEndpoint = `${OneDayMoreProductsEndpoint}/homepage`;

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [hasSectionsError, setHasSectionsError] = useState(false);

  useEffect(() => {
    setIsLoadingSections(true);
    setHasSectionsError(false);

    axios
      .get(homepageEndpoint)
      .then((res) => {
        const homepageData = res?.data?.result ?? {};
        setBestSellers(homepageData.best_sellers ?? []);
        setNewArrivals(homepageData.latest_arrivals ?? []);

        if (!homepageData.best_sellers && !homepageData.latest_arrivals) {
          setHasSectionsError(true);
        }
      })
      .catch(() => {
        setBestSellers([]);
        setNewArrivals([]);
        setHasSectionsError(true);
      })
      .finally(() => {
        setIsLoadingSections(false);
      });
  }, []);

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
            {isLoadingSections && (
              <p className="text-center fs-5 mb-0">Caricamento prodotti...</p>
            )}
            {!isLoadingSections && hasSectionsError && (
              <p className="text-center fs-5 mb-0">
                Non siamo riusciti a caricare i best seller.
              </p>
            )}
            {!isLoadingSections && !hasSectionsError && bestSellers.length === 0 && (
              <p className="text-center fs-5 mb-0">
                Nessun best seller disponibile al momento.
              </p>
            )}
            {!isLoadingSections &&
              !hasSectionsError &&
              bestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  productName={product.name}
                  productImage={product.image_url}
                  productCategorySlug={product.category_slug}
                  productPrice={product.price}
                  productShortDescr={
                    product.short_description || product.description
                  }
                  badgeText="Best seller"
                  productLink={
                    product.slug ? `/products/${product.slug}` : "/products"
                  }
                />
              ))}
          </div>

          <div className="text-center">
            <Link to="/products" className="btn btn-success text-center py-3">
              Visualizza tutti i prodotti
            </Link>
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
            {isLoadingSections && (
              <p className="text-center fs-5 mb-0">Caricamento prodotti...</p>
            )}
            {!isLoadingSections && hasSectionsError && (
              <p className="text-center fs-5 mb-0">
                Non siamo riusciti a caricare i nuovi arrivi.
              </p>
            )}
            {!isLoadingSections && !hasSectionsError && newArrivals.length === 0 && (
              <p className="text-center fs-5 mb-0">
                Nessun nuovo arrivo disponibile al momento.
              </p>
            )}
            {!isLoadingSections &&
              !hasSectionsError &&
              newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  productName={product.name}
                  productImage={product.image_url}
                  productCategorySlug={product.category_slug}
                  productPrice={product.price}
                  productShortDescr={
                    product.short_description || product.description
                  }
                  badgeText="Nuovo prodotto"
                  productLink={
                    product.slug ? `/products/${product.slug}` : "/products"
                  }
                />
              ))}
          </div>

          <div className="text-center">
            <Link to="/products" className="btn btn-dark text-center py-3">
              Visualizza tutti i prodotti
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
