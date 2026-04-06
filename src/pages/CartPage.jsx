import { useCartContext } from "../contexts/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCartContext();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return <h2 className="text-center mt-5">Carrello vuoto</h2>;
  }

  return (
    <div className="container mt-5">
      <h1>Carrello</h1>

      {cart.map((item) => {
        console.log(item);

        return (
          <div key={item.id} className="card mb-3 p-3">
            <div className="row align-items-center">
              <div className="col-md-3">
                <img
                  src={item.image_url || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "120px", objectFit: "cover" }}
                />
              </div>

              <div className="col-md-6">
                <h5>{item.name}</h5>
                <p>Prezzo: €{item.price}</p>
                <p>Quantità: {item.quantity}</p>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  className="btn btn-outline-secondary"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
              </div>

              <div className="col-md-3">
                <button
                  className="btn btn-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  Rimuovi
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div>
        {" "}
        <h3 className="mt-4">Totale: €{total.toFixed(2)}</h3>
        <button className="btn btn-primary"> completa il pagamento</button>
      </div>
    </div>
  );
}
