import { useMemo, useState, useCallback } from "react";
import { Link } from "react-router";
import { getCategoryFallbackImage } from "../utils/productImage";
import ProductImage from "./ProductImage";
import ProductBadges from "./ProductBadges";
import AvailabilityIndicator from "./AvailabilityIndicator";
import QtyControls from "./QtyControls";
import CompareToggleButton from "./CompareToggleButton";
import { useCartContext } from "../contexts/CartContext";
import { useAvailability } from "../hooks/useAvailability";
import { useNotificationContext } from "../contexts/NotificationContext";

function formatMoney(value) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "—";
  return numericValue.toFixed(2);
}

function formatListPrice(productPrice) {
  const n = Number(productPrice);
  return Number.isFinite(n) ? n.toFixed(2) : String(productPrice ?? "");
}

function getProductSlugFromLink(productLink) {
  const slugMatch = String(productLink || "").match(/\/products\/([^/?#]+)/);
  return slugMatch ? slugMatch[1] : null;
}

function ProductRowShell({
  className = "",
  image,
  mediaOverlay = null,
  title,
  meta = null,
  availabilityIndicator,
  actions,
  price,
}) {
  const priceNode =
    typeof price === "string" ? (
      <p className="cart-line-price mb-0">{price}</p>
    ) : (
      price
    );

  return (
    <div className={`cart-line-card ${className}`.trim()}>
      <div className="cart-line-inner">
        <div className="cart-line-media">
          <div className="cart-line-thumb">
            {image}
            {mediaOverlay}
          </div>
        </div>
        <div className="cart-line-main">
          <div className="cart-line-body">
            <div className="cart-line-body-copy">
              <div className="cart-line-name">{title}</div>
              {meta}
              {availabilityIndicator}
              <div className="cart-line-actions product-cart-controls">
                {actions}
              </div>
            </div>
            <div className="cart-line-col-price">{priceNode}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductRow({
  className = "",
  line,
  product,
  badges = [],
  productPrice,
  productLink,
  statLabel,
  statValue,
}) {
  const isCart = line != null;

  const {
    cart,
    addToCart,
    removeFromCart,
    restoreCartLine,
    increaseQuantity,
    decreaseQuantity,
  } = useCartContext();
  const { showNotification } = useNotificationContext();

  const slug = isCart
    ? line.slug
    : product?.slug ?? getProductSlugFromLink(productLink);
  const name = isCart ? line.name : product?.name;
  const destination = isCart
    ? `/products/${line.slug}`
    : productLink || "/products";
  const categorySlug = isCart ? line.category_slug : product?.category_slug;
  const rawImageUrl = isCart ? line.image_url : product?.image_url;

  const cartItem = useMemo(
    () => (slug ? cart.find((l) => l.slug === slug) : undefined),
    [cart, slug],
  );

  const availableStock = isCart
    ? line.quantity_available
    : product?.quantity_available ?? cartItem?.quantity_available ?? null;

  const quantityInCart = isCart ? line.quantity : (cartItem?.quantity ?? 0);

  const { isOutOfStock } = useAvailability(availableStock, quantityInCart);

  const fallbackImage = getCategoryFallbackImage(categorySlug);
  const [imageSrc, setImageSrc] = useState(
    () => rawImageUrl || fallbackImage,
  );

  const notifyLineRemovedWithUndo = useCallback(
    (snapshot) => {
      const label =
        (snapshot.name && String(snapshot.name).trim()) || "Prodotto";
      showNotification(`${label} rimosso dal carrello`, "muted", {
        duration: 8000,
        pointer: "cart",
        action: {
          label: "Annulla",
          onAction: () => restoreCartLine(snapshot),
        },
      });
    },
    [showNotification, restoreCartLine],
  );

  const handleDecrease = useCallback(() => {
    if (isCart) {
      if (line.quantity <= 1) {
        notifyLineRemovedWithUndo({ ...line });
      }
      decreaseQuantity(line.slug);
      return;
    }
    if (!slug || !cartItem) return;
    if (cartItem.quantity <= 1) {
      const label = (name && String(name).trim()) || "Prodotto";
      showNotification(`${label} rimosso dal carrello`, "muted", {
        duration: 3200,
        pointer: "cart",
      });
    }
    decreaseQuantity(slug);
  }, [
    isCart,
    line,
    slug,
    cartItem,
    name,
    decreaseQuantity,
    notifyLineRemovedWithUndo,
    showNotification,
  ]);

  const handleRemove = useCallback(() => {
    if (!isCart) return;
    notifyLineRemovedWithUndo({ ...line });
    removeFromCart(line.slug);
  }, [isCart, line, notifyLineRemovedWithUndo, removeFromCart]);

  const handleAddToCart = useCallback(() => {
    if (isCart) return;
    const canAdd = Boolean(slug && name) && !isOutOfStock;
    if (!canAdd) return;
    addToCart({
      slug,
      name,
      price: Number(productPrice),
      image_url: rawImageUrl || imageSrc,
      category_slug: categorySlug,
      quantity_available: availableStock,
    });
    showNotification("Prodotto aggiunto al carrello!", "success", {
      duration: 3200,
      pointer: "cart",
    });
  }, [
    isCart,
    slug,
    name,
    isOutOfStock,
    addToCart,
    productPrice,
    rawImageUrl,
    imageSrc,
    categorySlug,
    availableStock,
    showNotification,
  ]);

  const priceLabel = isCart
    ? `€${formatMoney(line.price * line.quantity)}`
    : productPrice != null && productPrice !== ""
      ? `€${formatListPrice(productPrice)}`
      : "—";

  const description =
    !isCart && product
      ? product.short_description || product.description || ""
      : "";

  const meta =
    !isCart &&
    ((statLabel != null && statValue != null) || description) ? (
      <>
        {statLabel != null && statValue != null ? (
          <p className="card-stat cart-line-meta-stat mb-2">
            <span className="card-stat-label">{statLabel}</span>
            <span className="card-stat-separator">·</span>
            <span className="card-stat-value">{statValue}</span>
          </p>
        ) : null}
        {description ? (
          <p className="card-text cart-line-lead mb-2">{description}</p>
        ) : null}
      </>
    ) : null;

  const mediaOverlay =
    !isCart && product ? (
      <>
        <ProductBadges badges={badges} />
        <CompareToggleButton product={product} variant="cardChip" />
      </>
    ) : isCart && line?.slug ? (
      <CompareToggleButton product={line} variant="cardChip" />
    ) : null;

  const cartRemoveButton = (visibilityClass) => (
    <button
      type="button"
      className={`btn btn-link cart-remove-link ${visibilityClass}`.trim()}
      onClick={handleRemove}
    >
      Rimuovi
    </button>
  );

  const actions = isCart ? (
    <>
      <QtyControls
        quantity={line.quantity}
        quantityAvailable={line.quantity_available}
        onIncrease={() => increaseQuantity(line.slug)}
        onDecrease={handleDecrease}
        trashWhenLast
      />
      {cartRemoveButton("cart-remove-link--desktop d-none d-sm-inline-block")}
    </>
  ) : cartItem ? (
    <QtyControls
      quantity={cartItem.quantity}
      quantityAvailable={availableStock}
      onIncrease={() => increaseQuantity(slug)}
      onDecrease={handleDecrease}
      trashWhenLast
    />
  ) : (
    <button
      type="button"
      className="btn btn-primary product-add-btn"
      onClick={handleAddToCart}
      disabled={!Boolean(slug && name) || isOutOfStock}
    >
      Aggiungi al carrello
    </button>
  );

  const availabilitySlug = isCart ? line.slug : product?.slug;

  const priceContent =
    isCart ? (
      <div className="cart-line-price-stack">
        <p className="cart-line-price mb-0">{priceLabel}</p>
        {cartRemoveButton("cart-remove-link--mobile d-sm-none")}
      </div>
    ) : (
      priceLabel
    );

  return (
    <ProductRowShell
      className={[isCart && "cart-line-card--cart", className]
        .filter(Boolean)
        .join(" ")
        .trim()}
      image={
        <Link
          to={destination}
          className="cart-line-image-link"
          aria-label={name || "Apri scheda prodotto"}
        >
          <ProductImage
            src={rawImageUrl}
            categorySlug={categorySlug}
            alt={name || "immagine-prodotto"}
            className="cart-line-image"
            onDisplaySrcChange={isCart ? undefined : setImageSrc}
          />
        </Link>
      }
      mediaOverlay={mediaOverlay}
      title={<Link to={destination}>{name}</Link>}
      meta={meta}
      availabilityIndicator={
        <AvailabilityIndicator
          slug={availabilitySlug}
          quantityAvailable={availableStock}
          showWhenAvailable={true}
          className="cart-line-availability mb-2 mt-0"
        />
      }
      actions={actions}
      price={priceContent}
    />
  );
}
