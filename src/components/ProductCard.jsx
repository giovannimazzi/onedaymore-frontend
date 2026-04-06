import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getCategoryFallbackImage } from "../utils/productImage";
import { categoryIconHandler } from "../utils/categoryIconHandler";

export default function ProductCard({
  productName,
  productImage,
  productCategorySlug,
  badgeText,
  badgeVariant,
  badgeVariant,
  productPrice,
  productShortDescr,
  productLink,
}) {
  const fallbackImage = getCategoryFallbackImage(productCategorySlug);
  const [imageSrc, setImageSrc] = useState(productImage || fallbackImage);
  const icon = categoryIconHandler(productCategorySlug);

  useEffect(() => {
    setImageSrc(productImage || fallbackImage);
  }, [productImage, fallbackImage]);

  const destination = productLink || "/products";

  const destination = productLink || "/products";

  return (
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
            <span className={`card-badge${badgeVariant === "gold" ? " card-badge--gold" : ""}`}>
              {badgeText}
            </span>
            <span className={`card-badge${badgeVariant === "gold" ? " card-badge--gold" : ""}`}>
              {badgeText}
            </span>
                )}
              </div>

              <div className="card-body d-flex flex-column p-3">
                {productName && (
                  <Link to={destination} className="card-name-link">
                    <h5 className="card-title">{productName}</h5>
                  </Link>
                )}
                {productShortDescr && (
                  <p className="card-text text-truncate">{productShortDescr}</p>
                )}
                {productPrice && <p className="card-price">€{productPrice}</p>}
                <button className="btn btn-primary w-100 mt-auto" disabled>
                  Aggiungi al carrello
                </button>
              </div>
            </div>
          </div>
          );
}
