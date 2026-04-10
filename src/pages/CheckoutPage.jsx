import { useState, useEffect } from "react";
import { useCartContext } from "../contexts/CartContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import ConfirmDialog from "../components/ConfirmDialog";
import ShippingInfo from "../components/ShippingInfo";
import { Link } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";

// Importa le variabili dal file utils/shipping
import {
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
} from "../utils/shipping";

function formatMoney(value) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "—";
  return numericValue.toFixed(2);
}

export default function CheckoutPage() {
  const { cart, clearCart, refreshCartAvailability } = useCartContext();
  const { showNotification } = useNotificationContext();
  const navigate = useNavigate();

  const [orderConfirmOpen, setOrderConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  const [discountCode, setDiscountCode] = useState("");
  const [discountData, setDiscountData] = useState(null);
  const [discountError, setDiscountError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    refreshCartAvailability();
  }, [refreshCartAvailability]);

  // TOTAL
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // APPLY DISCOUNT
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;

    setIsChecking(true);
    setDiscountError("");
    setDiscountData(null);

    try {
      const res = await axios.get(
        `http://localhost:3000/discount-codes/${discountCode}`,
      );

      const discount = res.data.result;

      if (!discount) {
        setDiscountError("Codice sconto inesistente");
        return;
      }

      const now = new Date();
      const startDate = new Date(discount.starts_at);
      const endDate = new Date(discount.ends_at);

      if (!discount.is_active) {
        setDiscountError("Questo codice non è attivo");
        return;
      }

      if (startDate > now) {
        setDiscountError(
          `Questo codice sarà attivo dal ${startDate.toLocaleDateString("it-IT")}`,
        );
        return;
      }

      if (endDate < now) {
        setDiscountError("Questo codice è scaduto");
        return;
      }

      if (
        discount.min_order_amount &&
        total < Number(discount.min_order_amount)
      ) {
        setDiscountError(
          `Ordine minimo €${formatMoney(discount.min_order_amount)}`,
        );
        return;
      }

      let discountAmount = 0;

      if (discount.discount_type === "percentage") {
        discountAmount = (total * discount.discount_value) / 100;
      } else {
        discountAmount = discount.discount_value;
      }

      if (discountAmount > total) {
        discountAmount = total;
      }

      setDiscountData({
        code: discount.code,
        discount_type: discount.discount_type,
        discount_value: discount.discount_value,
        discount_amount: discountAmount,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setDiscountError("Codice sconto inesistente");
      } else {
        setDiscountError("Errore nella verifica del codice");
      }
    } finally {
      setIsChecking(false);
    }
  };

  // CALCOLI
  const discountAmount = discountData?.discount_amount || 0;
  const subtotalAfterDiscount = total - discountAmount;
  const shippingCost =
    total >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const finalTotal = subtotalAfterDiscount + shippingCost;

  // FORM
  const [billingData, setBillingData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    province: "",
  });

  const [useDifferentShipping, setUseDifferentShipping] = useState(false);

  const [shippingData, setShippingData] = useState({
    name: "",
    surname: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    province: "",
  });

  // ================= VALIDAZIONE =================

  function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function isOptionalString(value) {
    return value === null || typeof value === "string";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[0-9+\s]{6,15}$/.test(phone);
  }

  function isValidPostalCode(code) {
    return /^[0-9]{4,10}$/.test(code);
  }

  function validateField(name, value) {
    const field = name.replace("shipping_", "");

    switch (field) {
      case "email":
        return isValidEmail(value) ? "" : "Email non valida";
      case "name":
        return isNonEmptyString(value) ? "" : "Nome obbligatorio";
      case "surname":
        return isNonEmptyString(value) ? "" : "Cognome obbligatorio";
      case "phone":
        return isValidPhone(value) ? "" : "Telefono non valido";
      case "address":
        return isNonEmptyString(value) ? "" : "Indirizzo obbligatorio";
      case "city":
        return isNonEmptyString(value) ? "" : "Città obbligatoria";
      case "zip":
        return isValidPostalCode(value) ? "" : "CAP non valido";
      case "province":
        return isOptionalString(value) ? "" : "Provincia non valida";
      default:
        return "";
    }
  }

  function validateOrderData({
    billingData,
    shippingData,
    useDifferentShipping,
    items,
  }) {
    const errors = [];

    if (!isValidEmail(billingData.email)) errors.push("Email non valida");
    if (!isNonEmptyString(billingData.name)) errors.push("Nome obbligatorio");
    if (!isNonEmptyString(billingData.surname))
      errors.push("Cognome obbligatorio");
    if (!isValidPhone(billingData.phone)) errors.push("Telefono non valido");
    if (!isNonEmptyString(billingData.address))
      errors.push("Indirizzo obbligatorio");
    if (!isNonEmptyString(billingData.city)) errors.push("Città obbligatoria");
    if (!isValidPostalCode(billingData.zip)) errors.push("CAP non valido");

    if (useDifferentShipping) {
      if (!isNonEmptyString(shippingData.address))
        errors.push("Indirizzo spedizione obbligatorio");
      if (!isNonEmptyString(shippingData.city))
        errors.push("Città spedizione obbligatoria");
      if (!isValidPostalCode(shippingData.zip))
        errors.push("CAP spedizione non valido");
    }

    if (!Array.isArray(items) || items.length === 0) {
      errors.push("Carrello vuoto");
    }

    return errors;
  }

  function getInputClass(fieldName) {
    return `form-control ${errors[fieldName] ? "is-invalid" : ""}`;
  }

  // ================= HANDLERS =================

  const handleBillingChange = (e) => {
    const { name, value } = e.target;

    setBillingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;

    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(`shipping_${name}`, value);

    setErrors((prev) => ({
      ...prev,
      [`shipping_${name}`]: error,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const itemsToValidate = cart.map((item) => ({
      slug: item.slug,
      quantity: item.quantity,
    }));

    const validationErrors = validateOrderData({
      billingData,
      shippingData,
      useDifferentShipping,
      items: itemsToValidate,
    });

    if (validationErrors.length > 0) {
      showNotification(validationErrors.join(" • "), "danger");
      return;
    }

    setOrderConfirmOpen(true);
  };

  const executeOrder = async () => {
    setOrderConfirmOpen(false);
    setIsSubmitting(true);

    try {
      const itemsToSend = cart.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
      }));

      const payload = {
        customer_email: billingData.email,
        customer_first_name: billingData.name,
        customer_last_name: billingData.surname,
        phone: billingData.phone,

        billing_address_line1: billingData.address,
        billing_city: billingData.city,
        billing_postal_code: billingData.zip,
        billing_province: billingData.province || null,
        billing_country: "IT",

        shipping_address_line1: useDifferentShipping
          ? shippingData.address
          : billingData.address,
        shipping_city: useDifferentShipping
          ? shippingData.city
          : billingData.city,
        shipping_postal_code: useDifferentShipping
          ? shippingData.zip
          : billingData.zip,
        shipping_province: useDifferentShipping
          ? shippingData.province || null
          : billingData.province || null,
        shipping_country: "IT",

        items: itemsToSend,

        discount_code: discountData?.code || null,
      };

      const response = await axios.post(
        "http://localhost:3000/orders",
        payload,
      );

      const orderNumber = response.data.result.order_number;

      clearCart();
      navigate(`/order-success/${orderNumber}`);
    } catch (error) {
      showNotification("Errore nell'ordine", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return <div className="container py-5 text-center">Carrello vuoto</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Checkout</h1>

      <div className="row g-4">
        {/* CHECKOUT */}
        <div className="col-lg-7">
          <form
            id="checkout-form"
            onSubmit={handleFormSubmit}
            className="card p-4"
          >
            <p className="mb-3">Dati di fatturazione</p>

            <div className="row g-3">
              <div className="col-md-6">
                <input
                  name="name"
                  placeholder="Nome"
                  className={getInputClass("name")}
                  onChange={handleBillingChange}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="col-md-6">
                <input
                  name="surname"
                  placeholder="Cognome"
                  className={getInputClass("surname")}
                  onChange={handleBillingChange}
                />
                {errors.surname && (
                  <div className="invalid-feedback">{errors.surname}</div>
                )}
              </div>

              <div className="col-md-6">
                <input
                  name="email"
                  placeholder="Email"
                  className={getInputClass("email")}
                  onChange={handleBillingChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="col-md-6">
                <input
                  name="phone"
                  placeholder="Telefono"
                  className={getInputClass("phone")}
                  onChange={handleBillingChange}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>

              <div className="col-12">
                <input
                  name="address"
                  placeholder="Indirizzo"
                  className={getInputClass("address")}
                  onChange={handleBillingChange}
                />
                {errors.address && (
                  <div className="invalid-feedback">{errors.address}</div>
                )}
              </div>

              <div className="col-md-4">
                <input
                  name="city"
                  placeholder="Città"
                  className={getInputClass("city")}
                  onChange={handleBillingChange}
                />
                {errors.city && (
                  <div className="invalid-feedback">{errors.city}</div>
                )}
              </div>

              <div className="col-md-4">
                <input
                  name="zip"
                  placeholder="CAP"
                  className={getInputClass("zip")}
                  onChange={handleBillingChange}
                />
                {errors.zip && (
                  <div className="invalid-feedback">{errors.zip}</div>
                )}
              </div>

              <div className="col-md-4">
                <input
                  name="province"
                  placeholder="Provincia"
                  className={getInputClass("province")}
                  onChange={handleBillingChange}
                />
              </div>
            </div>

            {/* CHECKBOX SHIPPING */}
            <div className="form-check my-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="differentShipping"
                checked={useDifferentShipping}
                onChange={(e) => setUseDifferentShipping(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="differentShipping">
                Usa un indirizzo di consegna diverso
              </label>
            </div>

            {/* SHIPPING */}
            {useDifferentShipping && (
              <>
                <p className="mb-3">Dati di consegna</p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      name="name"
                      placeholder="Nome"
                      className={getInputClass("shipping_name")}
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      name="surname"
                      placeholder="Cognome"
                      className={getInputClass("shipping_surname")}
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      name="phone"
                      placeholder="Telefono"
                      className={getInputClass("shipping_phone")}
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-12">
                    <input
                      name="address"
                      placeholder="Indirizzo"
                      className={getInputClass("shipping_address")}
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      name="city"
                      placeholder="Città"
                      className={getInputClass("shipping_city")}
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      name="zip"
                      placeholder="CAP"
                      className={getInputClass("shipping_zip")}
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      name="province"
                      placeholder="Provincia"
                      className={getInputClass("shipping_province")}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>
              </>
            )}
          </form>
        </div>

        {/* RIEPILOGO */}
        <div className="col-lg-5">
          <div className="card p-4 h-100 d-flex flex-column">
            <p>RIEPILOGO ORDINE</p>

            {/* CODICE SCONTO */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Codice sconto"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />

              <button
                className="btn btn-outline-primary w-100"
                onClick={handleApplyDiscount}
                disabled={isChecking}
              >
                {isChecking ? "Verifica..." : "Applica codice"}
              </button>

              {discountError && (
                <p className="text-danger small mt-2">{discountError}</p>
              )}
            </div>

            {/* PRODOTTI */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between mb-2"
              >
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>€{formatMoney(item.price * item.quantity)}</span>
              </div>
            ))}

            <hr />

            <p className="d-flex justify-content-between">
              <span>Subtotale</span>
              <span>€{formatMoney(total)}</span>
            </p>

            {discountData && (
              <p className="d-flex justify-content-between text-success">
                <span>Sconto ({discountData.code})</span>
                <span>-€{formatMoney(discountAmount)}</span>
              </p>
            )}

            <p className="d-flex justify-content-between">
              <span>Spedizione</span>
              <span>
                {shippingCost === 0
                  ? "Gratis 🎉"
                  : `€${formatMoney(shippingCost)}`}
              </span>
            </p>

            <hr />

            <p className="d-flex justify-content-between fw-bold">
              <span>Totale</span>
              <span>€{formatMoney(finalTotal)}</span>
            </p>

            <ShippingInfo cartTotal={total} className="mt-3" />

            {/* BOTTONE ORDINE */}
            <div className="mt-auto">
              <button
                type="submit"
                form="checkout-form"
                className="btn btn-success w-100 mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Invio..." : "Completa ordine"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={orderConfirmOpen}
        title="Completare l'ordine?"
        message="Stai per inviare l'ordine con i dati inseriti. Vuoi continuare?"
        confirmLabel="Conferma ordine"
        cancelLabel="Annulla"
        confirmVariant="primary"
        onConfirm={executeOrder}
        onCancel={() => setOrderConfirmOpen(false)}
      />
    </div>
  );
}
