import { useState } from "react";
import { useCartContext } from "../contexts/CartContext";
import ShippingInfo from "../components/ShippingInfo";
import { Link } from "react-router";

function formatMoney(value) {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "—";
  return numericValue.toFixed(2);
}

export default function CheckoutPage() {
  const { cart } = useCartContext();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("ORDINE:", {
      customer: formData,
      cart,
      total,
    });

    alert("Ordine inviato");
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
            <h4 className="mb-3">Dati cliente</h4>

            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  name="surname"
                  placeholder="Cognome"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  name="phone"
                  placeholder="Telefono"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <input
                  type="text"
                  name="address"
                  placeholder="Indirizzo"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  name="city"
                  placeholder="Città"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  name="zip"
                  placeholder="CAP"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="text"
                  name="province"
                  placeholder="Provincia"
                  className="form-control"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <textarea
                  name="notes"
                  placeholder="Note (opzionale)"
                  className="form-control"
                  rows="3"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success mt-4 w-100">
              Completa ordine
            </button>
          </form>
        </div>

        {/* RIEPILOGO */}
        <div className="col-lg-5">
          <div className="card p-4">
            <h4>Riepilogo ordine</h4>

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

            <h5>Totale: €{formatMoney(total)}</h5>

            <ShippingInfo cartTotal={total} className="mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
