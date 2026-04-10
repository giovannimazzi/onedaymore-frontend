import { useMemo, useState } from "react";
import { Link } from "react-router";
import { getCategoryFallbackImage } from "../utils/productImage";
import { useCartContext } from "../contexts/CartContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useAvailability } from "../hooks/useAvailability";
import AvailabilityIndicator from "./AvailabilityIndicator";
import QtyControls from "./QtyControls";
import ProductBadges from "./ProductBadges";
import ProductImage from "./ProductImage";
import CompareToggleButton from "./CompareToggleButton";

function getProductSlugFromLink(productLink) {
  const slugMatch = String(productLink || "").match(/\/products\/([^/?#]+)/);
  return slugMatch ? slugMatch[1] : null;
}

export default function ProductCard({
  productName,
  productImage,
  productCategorySlug,
  badges,
  productPrice,
  productLink,
  statLabel,
  statValue,
  productQuantityAvailable,
  compareProduct,
}) {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } =
    useCartContext();
  const { showNotification } = useNotificationContext();

  const fallbackImage = getCategoryFallbackImage(productCategorySlug);
  const [imageSrc, setImageSrc] = useState(() => productImage || fallbackImage);

  const destination = productLink || "/products";
  const productSlugForCart = useMemo(
    () => getProductSlugFromLink(productLink),
    [productLink],
  );
  const cartItem = useMemo(
    () => cart.find((line) => line.slug === productSlugForCart),
    [cart, productSlugForCart],
  );

  const availableStock =
    productQuantityAvailable ?? cartItem?.quantity_available ?? null;
  const quantityInCart = cartItem?.quantity ?? 0;
  const { isOutOfStock } = useAvailability(availableStock, quantityInCart);

  const handleAddToCart = () => {
    if (!productSlugForCart || productName == null || isOutOfStock) return;
    addToCart({
      slug: productSlugForCart,
      name: productName,
      price: Number(productPrice),
      image_url: productImage || imageSrc,
      category_slug: productCategorySlug,
      quantity_available: availableStock,
    });
    showNotification("Prodotto aggiunto al carrello!", "success", {
      duration: 3200,
      pointer: "cart",
    });
  };

  const canAddToCart =
    Boolean(productSlugForCart && productName != null) && !isOutOfStock;

  const handleDecreaseQty = () => {
    if (!productSlugForCart || !cartItem) return;
    if (cartItem.quantity <= 1) {
      const label = (productName && String(productName).trim()) || "Prodotto";
      showNotification(`${label} rimosso dal carrello`, "muted", {
        duration: 3200,
        pointer: "cart",
      });
    }
    decreaseQuantity(productSlugForCart);
  };

  return (
    <div className="col">
      <div className="card h-100">
        <div className="card-img-wrapper">
          <Link to={destination} className="card-img-link">
            <ProductImage
              src={productImage}
              categorySlug={productCategorySlug}
              alt={productName || "immagine-prodotto"}
              className="card-img-top"
              onDisplaySrcChange={setImageSrc}
            />
          </Link>
          <ProductBadges badges={badges} />
          {compareProduct && (
            <CompareToggleButton product={compareProduct} variant="cardChip" />
          )}
        </div>

        <div className="card-body d-flex flex-column p-3">
          {productName && (
            <Link to={destination} className="card-name-link">
              <h5 className="card-title">{productName}</h5>
            </Link>
          )}
          {productPrice != null && productPrice !== "" && (
            <p className="card-price">€{productPrice.toFixed(2)}</p>
          )}
          {statLabel != null && statValue != null && (
            <p className="card-stat">
              <span className="card-stat-label">{statLabel}</span>
              <span className="card-stat-separator">·</span>
              <span className="card-stat-value">{statValue}</span>
            </p>
          )}

          <AvailabilityIndicator
            slug={productSlugForCart}
            quantityAvailable={availableStock}
            showWhenAvailable={true}
            className="mb-3"
          />

          <div className="product-card-cart mt-auto w-100">
            {cartItem ? (
              <QtyControls
                quantity={cartItem.quantity}
                quantityAvailable={availableStock}
                onIncrease={() => increaseQuantity(productSlugForCart)}
                onDecrease={handleDecreaseQty}
                trashWhenLast
              />
            ) : (
              <button
                type="button"
                className="btn btn-primary w-100 product-add-btn"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
              >
                Aggiungi al carrello
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
