import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getCategoryFallbackImage } from "../utils/productImage";
import { categoryIconHandler } from "../utils/categoryIconHandler";
import { useCartContext } from "../contexts/CartContext";

export default function ProductCard({
  productName,
  productImage,
  productCategorySlug,
  badgeText,
  badgeVariant,
  productPrice,
  productShortDescr,
  productLink,
}) {
  const fallbackImage = getCategoryFallbackImage(productCategorySlug);
  const [imageSrc, setImageSrc] = useState(productImage || fallbackImage);
  const icon = categoryIconHandler(productCategorySlug);

  const { addToCart } = useCartContext();

  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: productLink?.split("/").pop(),
      name: productName,
      price: productPrice,
      image_url: imageSrc,
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  useEffect(() => {
    setImageSrc(productImage || fallbackImage);
  }, [productImage, fallbackImage]);

  const destination = productLink || "/products";

  return (
    <>
      <div className="col">
        <div className="card my-2 h-100">
          <div className="card-img-wrapper">
            <Link to={destination} className="card-img-link">
              <img
                src={imageSrc}
                className="card-img-top"
                alt={productName || "immagine-prodotto"}
                onError={() => setImageSrc(fallbackImage)}
              />
            </Link>
            {badgeText && (
              <span
                className={`card-badge${
                  badgeVariant === "gold" ? " card-badge--gold" : ""
                }`}
              >
                {badgeText}
              </span>
            )}
          </div>

          <div className="card-body d-flex flex-column p-3">
            {productName && (
              <Link to={destination} className="card-name-link">
                <h5 className="card-title d-flex justify-content-between align-items-start gap-2">
                  <span>{productName}</span>
                  <i className={`bi ${icon} fs-5 flex-shrink-0`} aria-hidden />
                </h5>
              </Link>
            )}
            {productShortDescr && (
              <p className="card-text text-truncate">{productShortDescr}</p>
            )}
            {productPrice && <p className="card-price">€{productPrice}</p>}

            <button
              className="btn btn-primary w-100 mt-auto"
              type="button"
              onClick={handleAddToCart}
            >
              Aggiungi al carrello
            </button>
          </div>
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
    </>
  );
}
