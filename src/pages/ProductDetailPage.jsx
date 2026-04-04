import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getCategoryFallbackImage } from "../utils/productImage";
import { useLoaderContext } from "../contexts/LoaderContext";
import { productsEndpoint } from "../utils/api";
import { useCartContext } from "../contexts/CartContext";

export default function ProductDetailPage() {
  const { startLoading, endLoading } = useLoaderContext();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fallbackImage = getCategoryFallbackImage(product?.category_slug);
  const [imageSrc, setImageSrc] = useState(fallbackImage);
  const { addToCart } = useCartContext();

  // Stato per il pop-up di conferma
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

  // Funzione per aggiungere al carrello con pop-up
  const handleAddToCart = () => {
    addToCart({
      id: product.slug,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500); // sparisce dopo 2,5s
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
    <div className="container mt-5 position-relative">
      <div className="row">
        {/* IMMAGINE */}
        <div className="col-md-6">
          <img
            src={imageSrc}
            alt={product.name}
            className="img-fluid rounded"
            onError={() => setImageSrc(fallbackImage)}
          />
        </div>

        {/* DETTAGLI */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <span className="badge bg-success p-2 mb-3">
            {product.badge || "Prodotto"}
          </span>

          <h1 className="mb-3">{product.name}</h1>

          <h3 className="mb-3">€{product.price}</h3>

          <p className="mb-4">
            {product.description ||
              product.short_description ||
              "Nessuna descrizione disponibile."}
          </p>

          <button className="btn btn-success mb-3" onClick={handleAddToCart}>
            Aggiungi al carrello
          </button>

          <Link to="/" className="btn btn-outline-secondary">
            Torna alla home
          </Link>
        </div>
      </div>

      {/* TOAST POP-UP */}
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
