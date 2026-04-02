import axios from "axios";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useLoaderContext } from "../contexts/LoaderContext";
import { productsEndpoint } from "../utils/api";

export default function ProductsPage() {
  const { startLoading, endLoading } = useLoaderContext();
  const [products, setProducts] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    startLoading();
    setHasError(false);

    axios
      .get(productsEndpoint)
      .then((res) => {
        setProducts(res.data.result ?? []);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        endLoading();
      });
  }, []);

  return (
    <div className="container my-4">
      <h1>I nostri prodotti</h1>

      {/* TODO: collegare la logica di ricerca e filtri */}
      <form className="row g-3 my-4 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Categoria</label>
          <select className="form-select">
            <option value="">Tutte le categorie</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Ordina per</label>
          <select className="form-select">
            <option value="">--</option>
            <option value="name">Nome</option>
            <option value="price">Prezzo</option>
            <option value="created_at">Più recenti</option>
          </select>
        </div>

        <div className="col-md-1">
          <label className="form-label">Direzione</label>
          <select className="form-select">
            <option value="asc">↑</option>
            <option value="desc">↓</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Cerca</label>
          <input
            type="text"
            className="form-control"
            placeholder="Nome prodotto..."
          />
        </div>

        <div className="col-md-2 d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            Cerca
          </button>
          <button type="button" className="btn btn-outline-secondary">
            Reset
          </button>
        </div>
      </form>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4 my-4">
        {hasError && (
          <p className="text-center fs-5">
            Non siamo riusciti a caricare i prodotti.
          </p>
        )}
        {!hasError && products.length === 0 && (
          <p className="text-center fs-5">Nessun prodotto trovato.</p>
        )}
        {products.map((product) => (
          <ProductCard
            key={product.id}
            productName={product.name}
            productImage={product.image_url}
            productCategorySlug={product.category_slug}
            productPrice={product.price}
            productShortDescr={product.short_description}
            productLink={
              product.slug ? `/products/${product.slug}` : "/products"
            }
          />
        ))}
      </div>
    </div>
  );
}
