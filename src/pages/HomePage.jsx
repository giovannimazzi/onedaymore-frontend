import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
import { useLoaderContext } from "../contexts/LoaderContext";
import { productsEndpoint } from "../utils/api";

const homepageEndpoint = `${productsEndpoint}/u/homepage`;

export default function HomePage() {
  const { startLoading, endLoading } = useLoaderContext();
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [hasSectionsError, setHasSectionsError] = useState(false);

  useEffect(() => {
    startLoading();
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
        endLoading();
      });
  }, []);

  return (
    <>
      <section className="hero d-flex flex-column justify-content-between align-items-start">
        <div>
          <h1>
            Per ogni giorno che <br /> non avevi previsto.
          </h1>
          <p className="fs-5">
            Preparati con prodotti essenziali per <br /> resistere, adattarti e
            continuare <br />
            ad andare avanti.
          </p>
        </div>
        <Link to="/products" className="btn btn-primary btn-lg px-5 py-3" style={{ alignSelf: "flex-start" }}>
          Scopri i prodotti
        </Link>
      </section>

      {/* BEST SELLERS */}
      <section className="py-5 mt-4">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-heading">Prodotti più venduti</h2>
            <p className="section-subtitle">
              Le soluzioni più apprezzate per prepararsi agli imprevisti
            </p>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 justify-content-center">
            {isLoadingSections && (
              <p className="text-center">Caricamento prodotti...</p>
            )}
            {!isLoadingSections && hasSectionsError && (
              <p className="text-center">
                Non siamo riusciti a caricare i best seller.
              </p>
            )}
            {!isLoadingSections && !hasSectionsError && bestSellers.length === 0 && (
              <p className="text-center">
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
                  productShortDescr={product.short_description || product.description}
                  badgeText="Best seller"
                  badgeVariant="gold"
                  productLink={product.slug ? `/products/${product.slug}` : "/products"}
                />
              ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-primary px-5 py-3">
              Visualizza tutti i prodotti
            </Link>
          </div>
        </div>
      </section>

      {/* NUOVI ARRIVI */}
      <section className="py-5 bg-success full-width">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-heading text-white">Nuovi arrivi</h2>
            <p className="section-subtitle text-white" style={{ opacity: 0.75 }}>
              Appena arrivati, pronti per ogni domani
            </p>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 justify-content-center">
            {isLoadingSections && (
              <p className="text-center">Caricamento prodotti...</p>
            )}
            {!isLoadingSections && hasSectionsError && (
              <p className="text-center">
                Non siamo riusciti a caricare i nuovi arrivi.
              </p>
            )}
            {!isLoadingSections && !hasSectionsError && newArrivals.length === 0 && (
              <p className="text-center">
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
                  productShortDescr={product.short_description || product.description}
                  badgeText="Nuovo arrivo"
                  productLink={product.slug ? `/products/${product.slug}` : "/products"}
                />
              ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-outline-light px-5 py-3">
              Visualizza tutti i prodotti
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
