import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getCategoryFallbackImage } from "../utils/productImage";
import { categoryIconHandler } from "../utils/categoryIconHandler";

export default function ProductCard({
  productName,
  productImage,
  productCategorySlug,
  badgeText,
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

  return (
    <div className="col" style={{ width: "20rem" }}>
      <div className="card my-2">
        <img
          src={imageSrc}
          className="card-img-top"
          alt={productName || "immagine-prodotto"}
          onError={() => {
            setImageSrc(fallbackImage);
          }}
        />

        <div className="card-body">
          {badgeText && (
            <span className="badge bg-success p-2 mb-3">{badgeText}</span>
          )}

          {productPrice && <h5 className="h3 mb-3">€{productPrice}</h5>}

          <div>
            {productName && (
              <h5 className="card-title d-flex justify-content-between">
                {productName} <i className={`bi ${icon} fs-5`} />
              </h5>
            )}
          </div>

          {productShortDescr && (
            <p className="card-text text-truncate">{productShortDescr}</p>
          )}

          <Link
            to={productLink || "/products"}
            className="btn btn-primary mb-4"
          >
            Vai al prodotto
          </Link>
        </div>
      </div>
    </div>
  );
}
