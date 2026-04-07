import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { getCategoryFallbackImage } from "../utils/productImage";
import { useLoaderContext } from "../contexts/LoaderContext";
import { productsEndpoint } from "../utils/api";
import { categoryIconHandler } from "../utils/categoryIconHandler";
import { useCartContext } from "../contexts/CartContext";
import { useAvailability } from "../hooks/useAvailability";
import { getProductBadges } from "../utils/productBadges";
import AvailabilityIndicator from "../components/AvailabilityIndicator";
import ProductBadges from "../components/ProductBadges";
import ProductImage from "../components/ProductImage";
import QtyControls from "../components/QtyControls";

const CATEGORY_LABEL = {
  "pasti-liofilizzati": "Pasti liofilizzati",
  "colazioni-e-snack": "Colazioni e snack",
  "razioni-alta-densita-calorica": "Alta densità calorica",
  "bevande-e-reintegro": "Bevande e reintegro",
};

const PREP_LABEL = {
  hot: "Calda",
  cold: "Fredda",
  ready: "Pronto all'uso",
  mixed: "Mista",
  add_cold_water: "Aggiungere acqua fredda",
  add_hot_water: "Aggiungere acqua calda",
  no_prep: "Pronto all'uso",
};

function formatPrepType(value) {
  if (!value) return null;
  if (PREP_LABEL[value]) return PREP_LABEL[value];
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatWeight(grams) {
  if (!grams) return null;
  return grams >= 1000
    ? `${(grams / 1000).toFixed(grams % 1000 === 0 ? 0 : 1)} kg`
    : `${grams} g`;
}

export default function ProductDetailPage() {
  const { startLoading, endLoading } = useLoaderContext();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(() =>
    getCategoryFallbackImage(undefined),
  );
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCartContext();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    startLoading();
    setIsLoading(true);

    axios
      .get(`${productsEndpoint}/${slug}`)
      .then((response) => {
        const payload =
          response?.data?.result ?? response?.data ?? null;
        const productFromResponse = Array.isArray(payload)
          ? payload[0]
          : payload;
        setProduct(productFromResponse || null);
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => {
        setIsLoading(false);
        endLoading();
      });
  }, [slug]);

  const cartItem = cart.find((line) => line.slug === product?.slug);

  const quantityInCart = cartItem?.quantity ?? 0;
  const { remaining, isOutOfStock } = useAvailability(
    product?.quantity_available ?? null,
    quantityInCart,
  );

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image_url: product.image_url || imageSrc,
      category_slug: product.category_slug,
      quantity_available: product.quantity_available,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const badgesForDetail = getProductBadges(product);

  const stats = product
    ? [
        product.calories != null && { label: "Calorie", value: `${product.calories} kcal` },
        product.weight_grams != null && { label: "Peso netto", value: formatWeight(product.weight_grams) },
        product.servings != null && { label: "Porzioni", value: product.servings },
        product.preparation_type && { label: "Preparazione", value: formatPrepType(product.preparation_type) },
      ].filter(Boolean)
    : [];

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
    <div className="container product-detail-page py-4 py-lg-5">
      <button
        type="button"
        className="btn btn-link product-detail-back text-decoration-none p-0 mb-3"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left me-2" aria-hidden />
        Torna indietro
      </button>

      <div className="row g-4 align-items-start">
        <div className="col-12 col-md-5 col-lg-5">
          <div className="product-detail-media">
            <ProductImage
              src={product.image_url}
              categorySlug={product.category_slug}
              alt={product.name}
              className="product-detail-img"
              onDisplaySrcChange={setImageSrc}
            />
          </div>
        </div>

        <div className="col-12 col-md-7 col-lg-4 product-detail-body">
          <ProductBadges badges={badgesForDetail} className="product-detail-badges" />

          <h1 className="product-detail-heading mb-1">{product.name}</h1>

          <div className="product-detail-category-row">
            <i
              className={`bi ${categoryIconHandler(product.category_slug)} product-detail-category-icon`}
              aria-hidden
            />
            <span className="product-detail-category-name">
              {CATEGORY_LABEL[product.category_slug] ?? product.category_slug}
            </span>
          </div>
          {product.category_description && (
            <p className="product-detail-category-desc">{product.category_description}</p>
          )}

          <p className="product-detail-desc mt-3 mb-3">
            {product.description || product.short_description || "Nessuna descrizione disponibile."}
          </p>

          {stats.length > 0 && (
            <ul className="product-detail-stats">
              {stats.map((statRow) => (
                <li key={statRow.label} className="product-detail-stat">
                  <span className="product-detail-stat-label">{statRow.label}</span>
                  <span className="product-detail-stat-value">{statRow.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-12 col-md-12 col-lg-3">
          <div className="product-detail-purchase">
            <p className="product-detail-purchase-price">€{product.price}</p>

            {product.total_sold > 0 && (
              <p className="product-detail-purchase-sold">
                <i className="bi bi-bag-check-fill me-1" aria-hidden />
                {product.total_sold} già acquistati
              </p>
            )}

            <AvailabilityIndicator 
              slug={product.slug} 
              quantityAvailable={product.quantity_available} 
            />

            <hr className="product-detail-purchase-separator" />

            {cartItem ? (
              <div className="mb-3">
                <p className="product-detail-purchase-quantity-label">Nel carrello</p>
                <QtyControls
                  quantity={cartItem.quantity}
                  quantityAvailable={product.quantity_available}
                  onIncrease={() => increaseQuantity(product.slug)}
                  onDecrease={() => decreaseQuantity(product.slug)}
                />
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-100 product-add-btn product-detail-add-btn mb-3"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Prodotto esaurito" : "Aggiungi al carrello"}
              </button>
            )}

            {cartItem && (
              <Link to="/cart" className="btn btn-outline-secondary w-100 product-detail-goto-cart mb-3">
                Vai al carrello
              </Link>
            )}

            <ul className="product-detail-purchase-trust">
              <li><i className="bi bi-shield-check me-2" aria-hidden />Qualità garantita</li>
              <li><i className="bi bi-arrow-counterclockwise me-2" aria-hidden />Reso semplificato</li>
              <li><i className="bi bi-lock me-2" aria-hidden />Pagamento sicuro</li>
            </ul>

          </div>
        </div>
      </div>

      {showToast && (
        <div className="product-detail-toast" role="status" aria-live="polite">
          <i className="bi bi-cart-check me-2" aria-hidden />
          Prodotto aggiunto al carrello!
        </div>
      )}
    </div>
  );
}
