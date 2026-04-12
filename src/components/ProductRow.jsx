import { Link } from "react-router";
import ProductImage from "./ProductImage";
import ProductBadges from "./ProductBadges";
import AvailabilityIndicator from "./AvailabilityIndicator";
import QtyControls from "./QtyControls";
import CompareToggleButton from "./CompareToggleButton";
import { useProductRowCart } from "../hooks/useProductRowCart";

function ProductRowLayout({
  className = "",
  image,
  mediaOverlay = null,
  titleTo,
  titleText,
  meta = null,
  availabilityIndicator,
  actions,
  price,
}) {
  const priceNode =
    typeof price === "string" ? (
      <p className="product-row-price product-price-value mb-0">{price}</p>
    ) : (
      price
    );

  return (
    <div className={`product-row ${className}`.trim()}>
      <div className="product-row-inner">
        <div className="product-row-media">
          <div className="product-row-thumb">
            {image}
            {mediaOverlay}
          </div>
        </div>
        <div className="product-row-main">
          <div className="product-row-body">
            <div className="product-row-body-copy">
              {titleText ? (
                <Link to={titleTo} className="product-title-link">
                  <h5 className="product-title">{titleText}</h5>
                </Link>
              ) : null}
              {meta}
              {availabilityIndicator}
              <div className="product-row-actions product-cart-controls">
                {actions}
              </div>
            </div>
            <div className="product-row-col-price">{priceNode}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductRow({
  className = "",
  cartLine,
  product,
  badges = [],
  productPrice,
  productLink,
  statLabel,
  statValue,
}) {
  const {
    isCart,
    slug,
    name,
    destination,
    categorySlug,
    rawImageUrl,
    setImageSrc,
    availabilitySlug,
    cartItem,
    availableStock,
    isOutOfStock,
    handleDecrease,
    handleRemove,
    handleAddToCart,
    increaseQuantity,
    priceLabel,
  } = useProductRowCart({
    cartLine,
    product,
    productPrice,
    productLink,
  });

  const description =
    !isCart && product
      ? product.short_description || product.description || ""
      : "";

  const meta =
    !isCart &&
    ((statLabel != null && statValue != null) || description) ? (
      <>
        {statLabel != null && statValue != null ? (
          <p className="product-stat mb-2">
            <span className="product-stat-label">{statLabel}</span>
            <span className="product-stat-separator">·</span>
            <span className="product-stat-value">{statValue}</span>
          </p>
        ) : null}
        {description ? (
          <p className="card-text product-row-lead mb-2">{description}</p>
        ) : null}
      </>
    ) : null;

  const mediaOverlay =
    !isCart && product ? (
      <>
        <ProductBadges badges={badges} />
        <CompareToggleButton product={product} variant="cardChip" />
      </>
    ) : isCart && cartLine?.slug ? (
      <CompareToggleButton product={cartLine} variant="cardChip" />
    ) : null;

  const cartRemoveButton = (visibilityClass) => (
    <button
      type="button"
      className={`btn btn-link product-row-remove-link ${visibilityClass}`.trim()}
      onClick={handleRemove}
    >
      Rimuovi
    </button>
  );

  const actions = isCart ? (
    <>
      <QtyControls
        quantity={cartLine.quantity}
        quantityAvailable={cartLine.quantity_available}
        onIncrease={() => increaseQuantity(cartLine.slug)}
        onDecrease={handleDecrease}
        trashWhenLast
      />
      {cartRemoveButton(
        "product-row-remove-link--desktop d-none d-sm-inline-block",
      )}
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
      disabled={!slug || !name || isOutOfStock}
    >
      Aggiungi al carrello
    </button>
  );

  const priceContent =
    isCart ? (
      <div className="product-row-price-stack">
        <p className="product-row-price mb-0">{priceLabel}</p>
        {cartRemoveButton("product-row-remove-link--mobile d-sm-none")}
      </div>
    ) : (
      priceLabel
    );

  return (
    <ProductRowLayout
      className={[isCart && "product-row--cart", className]
        .filter(Boolean)
        .join(" ")
        .trim()}
      image={
        <Link
          to={destination}
          className="product-row-image-link"
          aria-label={name || "Apri scheda prodotto"}
        >
          <ProductImage
            src={rawImageUrl}
            categorySlug={categorySlug}
            alt={name || "immagine-prodotto"}
            className="product-row-image"
            onDisplaySrcChange={isCart ? undefined : setImageSrc}
          />
        </Link>
      }
      mediaOverlay={mediaOverlay}
      titleTo={destination}
      titleText={name}
      meta={meta}
      availabilityIndicator={
        <AvailabilityIndicator
          slug={availabilitySlug}
          quantityAvailable={availableStock}
          showWhenAvailable={true}
          className="product-row-availability mb-2 mt-0"
        />
      }
      actions={actions}
      price={priceContent}
    />
  );
}
