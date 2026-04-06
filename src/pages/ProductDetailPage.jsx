import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getCategoryFallbackImage } from "../utils/productImage";
import { useLoaderContext } from "../contexts/LoaderContext";
import { productsEndpoint } from "../utils/api";
import { categoryIconHandler } from "../utils/categoryIconHandler";
import { useCartContext } from "../contexts/CartContext";

export default function ProductDetailPage() {
  const { startLoading, endLoading } = useLoaderContext();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fallbackImage = getCategoryFallbackImage(product?.category_slug);
  const [imageSrc, setImageSrc] = useState(fallbackImage);
  const { addToCart } = useCartContext();
  const [showToast, setShowToast] = useState(false);

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

  const handleAddToCart = () => {
    addToCart({
      id: product.slug,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

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
        <div className="col-md-6">
          <img
            src={imageSrc}
            alt={product.name}
            className="img-fluid rounded"
            onError={() => setImageSrc(fallbackImage)}
          />
        </div>

        <div className="col-md-6 d-flex flex-column justify-content-center">
          <span className="badge bg-primary mb-3 px-3 py-2">
            {product.badge || "Prodotto"}
          </span>

          <h1 className="mb-0">
            {product.name}{" "}
            <i
              className={`bi ${categoryIconHandler(product.category_slug)}`}
              aria-hidden
            />
          </h1>

          <div className="my-2">
            {product.category_description && (
              <p className="small text-muted mb-0">
                <em>{product.category_description}</em>
              </p>
            )}
          </div>

          <p className="card-price mb-3">€{product.price}</p>

          <p className="mb-4">
            {product.description ||
              product.short_description ||
              "Nessuna descrizione disponibile."}
          </p>

          <button
            type="button"
            className="btn btn-primary w-100 py-3 mb-3"
            onClick={handleAddToCart}
          >
            Aggiungi al carrello
          </button>

          <Link to="/" className="btn btn-outline-dark w-100">
            Torna alla home
          </Link>
        </div>
      </div>

      {showToast && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#28a745",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 9999,
          }}
        >
          Prodotto aggiunto al carrello!
        </div>
      )}
    </div>
  );
}
