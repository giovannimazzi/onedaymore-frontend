import { useState } from "react";
import { useCartContext } from "../contexts/CartContext";
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
  const { cart, clearCart } = useCartContext();
  const navigate = useNavigate();

  // DISCOUNT STATE
  const [discountCode, setDiscountCode] = useState("");
  const [discountData, setDiscountData] = useState(null);
  const [discountError, setDiscountError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

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
    notes: "",
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

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmOrder = window.confirm(
      "Sei sicuro di voler completare l'ordine?",
    );
    if (!confirmOrder) return;

    try {
      const itemsToSend = cart.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
      }));

      const payload = {
        customer_email: billingData.email,
        customer_first_name: billingData.name,
        customer_last_name: billingData.surname,
        phone: billingData.phone || "",

        billing_address_line1: billingData.address,
        billing_address_line2: null,
        billing_city: billingData.city,
        billing_postal_code: billingData.zip,
        billing_province: billingData.province || null,
        billing_country: "IT",

        shipping_address_line1: useDifferentShipping
          ? shippingData.address
          : billingData.address,
        shipping_address_line2: null,
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

      console.log("SUCCESSO:", response.data);
      alert("Ordine completato!");
      const orderNumber = response.data.result.order_number;
      clearCart();
      navigate(`/order-success/${orderNumber}`);
    } catch (error) {
      console.error(error.response?.data || error);
      alert(
        "Errore nell'ordine: " +
          (error.response?.data?.message || "Controlla i dati inseriti"),
      );
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Il carrello è vuoto</h2>
        <Link to="/products" className="btn btn-primary mt-3">
          Vai ai prodotti
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Checkout</h1>

      <div className="row g-4">
        {/* FORM */}
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} className="card p-4">
            <p className="mb-3">Dati di fatturazione</p>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome"
                  className="form-control"
                  required
                  onChange={handleBillingChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  name="surname"
                  placeholder="Cognome"
                  className="form-control"
                  required
                  onChange={handleBillingChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control"
                  required
                  onChange={handleBillingChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  name="phone"
                  placeholder="Telefono"
                  className="form-control"
                  required
                  onChange={handleBillingChange}
                />
              </div>

              <div className="col-12">
                <input
                  type="text"
                  name="address"
                  placeholder="Indirizzo"
                  className="form-control"
                  required
                  onChange={handleBillingChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  name="city"
                  placeholder="Città"
                  className="form-control"
                  required
                  onChange={handleBillingChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  name="zip"
                  placeholder="CAP"
                  className="form-control"
                  required
                  onChange={handleBillingChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  name="province"
                  placeholder="Provincia"
                  className="form-control"
                  required
                  onChange={handleBillingChange}
                />
              </div>
            </div>

            {/* CHECKBOX PER SHIPPING DIVERSO */}
            <div className="form-check my-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="differentShipping"
                checked={useDifferentShipping}
                onChange={(e) => setUseDifferentShipping(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="differentShipping">
                I dati di consegna sono diversi dai dati di fatturazione
              </label>
            </div>

            {/* FORM CONSEGNA */}
            {useDifferentShipping && (
              <>
                <p className="mb-3 mt-3">Dati di consegna</p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Nome"
                      className="form-control"
                      required
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      name="surname"
                      placeholder="Cognome"
                      className="form-control"
                      required
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Telefono"
                      className="form-control"
                      required
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-12">
                    <input
                      type="text"
                      name="address"
                      placeholder="Indirizzo"
                      className="form-control"
                      required
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="Città"
                      className="form-control"
                      required
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="text"
                      name="zip"
                      placeholder="CAP"
                      className="form-control"
                      required
                      onChange={handleShippingChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <input
                      type="text"
                      name="province"
                      placeholder="Provincia"
                      className="form-control"
                      required
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>
              </>
            )}
            <button type="submit" className="btn btn-success mt-4 w-100">
              Completa ordine
            </button>
          </form>
        </div>

        {/* RIEPILOGO */}
        <div className="col-lg-5">
          <div className="card p-4">
            <h4>Riepilogo ordine</h4>

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
            <p className="d-flex justify-content-between">
              <span>Totale</span>
              <span>€{formatMoney(finalTotal)}</span>
            </p>

            <ShippingInfo cartTotal={total} className="mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
