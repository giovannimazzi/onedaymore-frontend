import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getCategoryFallbackImage } from "../utils/productImage";
import { useLoaderContext } from "../contexts/LoaderContext";
import { productsEndpoint } from "../utils/api";
import { categoryIconHandler } from "../utils/categoryIconHandler";

export default function ProductDetailPage() {
  const { startLoading, endLoading } = useLoaderContext();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fallbackImage = getCategoryFallbackImage(product?.category_slug);
  const [imageSrc, setImageSrc] = useState(fallbackImage);

  useEffect(() => {
    startLoading();
    setIsLoading(true);

    axios
      .get(`${productsEndpoint}/${slug}`)
      .then((res) => {
        const payload = res?.data?.result ?? res?.data ?? null;
        const resolvedProduct = Array.isArray(payload) ? payload[0] : payload;
        setProduct(resolvedProduct || null);
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => {
        setIsLoading(false);
        endLoading();
      });
  }, [slug]);

  useEffect(() => {
    setImageSrc(product?.image_url || fallbackImage);
  }, [product, fallbackImage]);

  if (isLoading) {
    return (
      <div className="container mt-5">
        <h2>Caricamento prodotto...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <h2>Prodotto non trovato</h2>
        <Link to="/" className="btn btn-primary mt-3">
          Torna alla home
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        {/* IMMAGINE */}
        <div className="col-md-6">
          <img
            src={imageSrc}
            alt={product.name}
            className="img-fluid rounded"
            onError={() => {
              setImageSrc(fallbackImage);
            }}
          />
        </div>

        {/* DETTAGLI */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <span className="badge bg-success p-2 mb-3">
            {product.badge || "Prodotto"}
          </span>

          <h1 className="mb-0">
            {product.name}{" "}
            <i
              className={`bi ${categoryIconHandler(product.category_slug)}`}
            />
          </h1>
          <div className="my-2">
            {/* DESCRIZIONE CATEGORIA */}
            {product.category_description && (
              <p className="small text-muted mb-0">
                {" "}
                <em>{product.category_description}</em>
              </p>
            )}
          </div>
          <h3 className="mb-3">€{product.price}</h3>

          <p className="mb-4">
            {product.description ||
              product.short_description ||
              "Nessuna descrizione disponibile."}
          </p>

          <button className="btn btn-success mb-3">Aggiungi al carrello</button>

          <Link to="/" className="btn btn-outline-secondary">
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}
