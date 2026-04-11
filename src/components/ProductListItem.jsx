import { Link } from "react-router";
import ProductImage from "./ProductImage";
import ProductBadges from "./ProductBadges";
import AvailabilityIndicator from "./AvailabilityIndicator";
import QtyControls from "./QtyControls";
import { useCartContext } from "../contexts/CartContext";
import { useAvailability } from "../hooks/useAvailability";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useMemo } from "react";

function getProductSlugFromLink(productLink) {
  const slugMatch = String(productLink || "").match(/\/products\/([^/?#]+)/);
  return slugMatch ? slugMatch[1] : null;
}

export default function ProductListItem({
  product,
  badges = [],
  productPrice,
  productLink,
  statLabel,
  statValue,
}) {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } =
    useCartContext();
  const { showNotification } = useNotificationContext();

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
    product.quantity_available ?? cartItem?.quantity_available ?? null;

  const quantityInCart = cartItem?.quantity ?? 0;

  const { isOutOfStock } = useAvailability(availableStock, quantityInCart);

  const canAddToCart =
    Boolean(productSlugForCart && product?.name) && !isOutOfStock;

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    addToCart({
      slug: productSlugForCart,
      name: product.name,
      price: Number(productPrice),
      image_url: product.image_url,
      category_slug: product.category_slug,
      quantity_available: availableStock,
    });

    showNotification("Prodotto aggiunto al carrello!", "success");
  };

  return (
    <article className="product-list-item">
      <div className="product-list-item__media">
        <Link to={destination} className="product-list-item__image-link">
          <ProductImage
            src={product.image_url}
            categorySlug={product.category_slug}
            alt={product.name || "immagine-prodotto"}
            className="product-list-item__image"
          />
        </Link>
        <ProductBadges badges={badges} />
      </div>

      <div className="product-list-item__content">
        <Link to={destination} className="product-list-item__title-link">
          <h3 className="product-list-item__title">{product.name}</h3>
        </Link>

        {(product.short_description || product.description) && (
          <p className="product-list-item__description">
            {product.short_description || product.description}
          </p>
        )}

        <div className="product-list-item__meta">
          <AvailabilityIndicator
            slug={product.slug}
            quantityAvailable={availableStock}
            showWhenAvailable={true}
          />

          {statLabel != null && statValue != null && (
            <span className="product-list-item__stat">
              <strong>{statLabel}</strong>: {statValue}
            </span>
          )}
        </div>
      </div>

      <div className="product-list-item__actions">
        {productPrice != null && productPrice !== "" && (
          <div className="product-list-item__price">€{productPrice}</div>
        )}

        <Link
          to={destination}
          className="btn btn-primary product-list-item__btn"
        >
          Vedi prodotto
        </Link>

        <div className="d-flex gap-2 mt-2">
          {cartItem ? (
            <QtyControls
              quantity={cartItem.quantity}
              quantityAvailable={availableStock}
              onIncrease={() => increaseQuantity(productSlugForCart)}
              onDecrease={() => decreaseQuantity(productSlugForCart)}
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

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => handleCompare(product)}
          >
            Confronta
          </button>
        </div>
      </div>
    </article>
  );
}
