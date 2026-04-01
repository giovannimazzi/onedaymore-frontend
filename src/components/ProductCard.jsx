export default function ProductCard({ badgeText }) {
  return (
    <div className="col" style={{ width: "20rem" }}>
      <div className="card">
        <img
          src="https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg"
          className="card-img-top"
          alt="Cibo"
        />
        <div className="card-body">
          {badgeText && (
            <span className="badge bg-success p-2 mb-3">{badgeText}</span>
          )}
          <h5 className="h3 mb-3">€50,00</h5>
          <h5 className="card-title">Card title</h5>
          <p className="card-text">
            Some quick example text to build on the card title.
          </p>
          <a href="#" className="btn btn-primary mb-4">
            Vai al prodotto
          </a>
        </div>
      </div>
    </div>
  );
}
