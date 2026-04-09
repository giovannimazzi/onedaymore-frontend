import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <>
      <div className="not-found-container">
        <img
          className="not-found-img"
          src="src/assets/css/img/404.png"
          alt="404 - Not Found"
        />
        <div className="not-found-texts">
          <h2 className="not-found h1 text-light text-center fw-bold">
            404 - Pagina non trovata
          </h2>
          <p className="not-found text-light text-center fs-4 fw-bold">
            Non è stato possibile trovare la pagina che stai cercando, ma non
            temere, perdersi e ritrovarsi fa parte della sopravvivenza
          </p>
          <Link to="/" className="d-block text-center fs-3">
            Torna alla Home
          </Link>
        </div>
      </div>
    </>
  );
}
