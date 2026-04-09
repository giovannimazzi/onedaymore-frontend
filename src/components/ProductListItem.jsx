import { Link } from 'react-router';
import ProductImage from './ProductImage';
import ProductBadges from './ProductBadges';
import AvailabilityIndicator from './AvailabilityIndicator';

export default function ProductListItem({
  product,
  badges = [],
  productPrice,
  productLink,
  statLabel,
  statValue,
}) {
  const destination = productLink || '/products';

  return (
    <article className="product-list-item">
      <div className="product-list-item__media">
        <Link to={destination} className="product-list-item__image-link">
          <ProductImage
            src={product.image_url}
            categorySlug={product.category_slug}
            alt={product.name || 'immagine-prodotto'}
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
            quantityAvailable={product.quantity_available}
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
        {productPrice != null && productPrice !== '' && (
          <div className="product-list-item__price">€{productPrice}</div>
        )}

        <Link
          to={destination}
          className="btn btn-primary product-list-item__btn"
        >
          Vedi prodotto
        </Link>
      </div>
    </article>
  );
}
