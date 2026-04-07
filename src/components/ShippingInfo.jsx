import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
  formatShippingPrice,
  getRemainingForFreeShipping,
  hasFreeShipping,
  getFreeShippingProgress,
} from "../utils/shipping";

export default function ShippingInfo({ cartTotal, className = "" }) {
  const hasCartTotal = cartTotal !== undefined && cartTotal !== null;
  const numericCartTotal = Number(cartTotal);
  const showCartState =
    hasCartTotal && !Number.isNaN(numericCartTotal) && numericCartTotal > 0;

  const baseMessage = `Spedizione standard €${formatShippingPrice(
    STANDARD_SHIPPING_COST,
  )} · gratuita da €${formatShippingPrice(FREE_SHIPPING_THRESHOLD)}`;

  let secondaryMessage = "";
  let progress = 0;
  let isFreeShippingReached = false;

  if (showCartState) {
    isFreeShippingReached = hasFreeShipping(numericCartTotal);
    progress = getFreeShippingProgress(numericCartTotal);

    secondaryMessage = isFreeShippingReached
      ? "Hai ottenuto la spedizione gratuita"
      : `Ti mancano ancora €${formatShippingPrice(
          getRemainingForFreeShipping(numericCartTotal),
        )} per la spedizione gratuita`;
  }

  return (
    <div className={`shipping-info ${className}`.trim()}>
      <div className="shipping-info__content">
        <p className="shipping-info__base mb-0 me-2">{baseMessage}</p>

        {showCartState && (
          <p
            className={`shipping-info__secondary mb-0${
              isFreeShippingReached ? " shipping-info__secondary--success" : ""
            }`}
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
