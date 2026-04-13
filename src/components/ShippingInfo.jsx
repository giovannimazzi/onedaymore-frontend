import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  formatShippingPrice,
  getRemainingForFreeShipping,
  hasFreeShipping,
  getFreeShippingProgress,
} from '../utils/shipping';

export default function ShippingInfo({ cartTotal, className = '' }) {
  const hasCartTotal = cartTotal !== undefined && cartTotal !== null;
  const numericCartTotal = Number(cartTotal);
  const showCartState =
    hasCartTotal && !Number.isNaN(numericCartTotal) && numericCartTotal > 0;

  const baseMessage = (
    <>
      <i className="bi bi-truck shipping-info__lead-icon" aria-hidden />
      <span>
        Spedizione standard €{formatShippingPrice(STANDARD_SHIPPING_COST)} ·{' '}
        <span className="shipping-info__free-tag">
          Gratuita da €{formatShippingPrice(FREE_SHIPPING_THRESHOLD)}
        </span>
      </span>
    </>
  );

  let secondaryMessage = '';
  let progress = 0;
  let isFreeShippingReached = false;

  if (showCartState) {
    isFreeShippingReached = hasFreeShipping(numericCartTotal);
    progress = getFreeShippingProgress(numericCartTotal);

    secondaryMessage = isFreeShippingReached ? (
      <span className="shipping-info__success-callout">
        <i
          className="bi bi-check-circle-fill shipping-info__success-callout-icon"
          aria-hidden
        />
        Hai ottenuto la spedizione gratuita
      </span>
    ) : (
      <>
        <i className="bi bi-gift shipping-info__secondary-icon" aria-hidden />
        <span>
          Ti mancano ancora €
          {formatShippingPrice(getRemainingForFreeShipping(numericCartTotal))}{' '}
          per la{' '}
          <span className="shipping-info__free-inline">spedizione gratuita</span>
        </span>
      </>
    );
  }

  return (
    <div className={`shipping-info ${className}`.trim()}>
      <div className="shipping-info__content">
        <p className="shipping-info__base mb-0 me-2 shipping-info__base-row">
          {baseMessage}
        </p>

        {showCartState && (
          <p
            className={[
              'shipping-info__secondary mb-0',
              isFreeShippingReached
                ? 'shipping-info__secondary--success'
                : 'shipping-info__secondary--progress',
            ].join(' ')}
          >
            {secondaryMessage}
          </p>
        )}
      </div>

      {showCartState && (
        <div
          className="shipping-info__progress"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span
            className="shipping-info__progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
