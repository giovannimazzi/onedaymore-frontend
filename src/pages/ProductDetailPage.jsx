import { useParams, Link } from "react-router";

const products = [
  {
    id: 1,
    name: "Kit Sopravvivenza Base",
    price: 50,
    description: "Kit essenziale per affrontare emergenze di base.",
    image: "https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg",
    badge: "Best seller",
  },
  {
    id: 2,
    name: "Kit Avanzato",
    price: 80,
    description: "Più completo per affrontare situazioni difficili.",
    image: "https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg",
    badge: "Best seller",
  },
  {
    id: 3,
    name: "Kit Estremo",
    price: 120,
    description: "Per sopravvivere anche nelle condizioni più estreme.",
    image: "https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg",
    badge: "Best seller",
  },
  {
    id: 4,
    name: "Kit Fresh Start",
    price: 60,
    description: "Nuova soluzione per iniziare a prepararsi.",
    image: "https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg",
    badge: "Nuovo prodotto",
  },
  {
    id: 5,
    name: "Kit Survival Pro",
    price: 90,
    description: "Pensato per utenti più esperti.",
    image: "https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg",
    badge: "Nuovo prodotto",
  },
  {
    id: 6,
    name: "Kit Apocalypse",
    price: 150,
    description: "Il massimo per ogni scenario estremo.",
    image: "https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg",
    badge: "Nuovo prodotto",
  },
];

export default function ProductDetailPage() {
  const { slug } = useParams();

  // Cerchiamo per id, non per slug
  const product = products.find((p) => p.id === parseInt(slug, 10));

  if (!product) {
    return (
      <div className="container mt-5">
        <h2>Prodotto non trovato</h2>
        <Link to="/" className="btn btn-primary mt-3">
          Torna alla home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* IMMAGINE */}
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>

        {/* DETTAGLI */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <span className="badge bg-success p-2 mb-3">{product.badge}</span>

          <h1 className="mb-3">{product.name}</h1>

          <h3 className="mb-3">€{product.price}</h3>

          <p className="mb-4">{product.description}</p>

          <button className="btn btn-success mb-3">Aggiungi al carrello</button>

          <Link to="/" className="btn btn-outline-secondary">
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}
