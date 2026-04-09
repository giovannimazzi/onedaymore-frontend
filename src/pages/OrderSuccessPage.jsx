import { useParams, Link } from "react-router";

export default function OrderSuccessPage() {
  const { id } = useParams();

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">🎉 Ordine completato!</h1>

      <p className="fs-5">Il tuo ordine è stato ricevuto correttamente.</p>

      <p>
        ID ordine: <strong>#{id}</strong>
      </p>

      <p className="text-muted">Riceverai una email di conferma a breve.</p>

      <Link to="/products" className="btn btn-primary mt-4">
        Continua lo shopping
      </Link>
    </div>
  );
}
