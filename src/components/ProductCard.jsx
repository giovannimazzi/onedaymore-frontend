export default function CardComponent() {
  return (
    <div className="col">
      <div class="card product-card">
        <img src="..." class="card-img-top" alt="Immagine prodotto" />
        <div class="card-body">
          <h5 class="card-title">Nome Prodotto</h5>
          <span class="product-category">Categoria</span>
          <p class="card-text">Breve descrizione del prodotto.</p>
          <div class="product-footer d-flex flex-column">
            <span class="product-price">€29.99</span>
            <button class="btn btn-primary add-to-cart">
              Aggiungi al carrello
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
