export default function CardComponent() {
  return (
    <div className="col">
      <div className="card product-card">
        <img src="..." className="card-img-top" alt="Immagine prodotto" />
        <div className="card-body">
          <h5 className="card-title">Nome Prodotto</h5>
          <span className="product-category text-muted">Categoria</span>
          <p className="card-text">Breve descrizione del prodotto</p>
          <div className="product-footer d-flex flex-column">
            <span className="product-price">€29.99</span>
            <button className="btn btn-primary add-to-cart">
              Aggiungi al carrello
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
