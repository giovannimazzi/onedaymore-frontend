export default function ProductCard({
  productName,
  productImage,
  badgeText,
  productPrice,
  productShortDescr,
}) {
  const defaultImage = "https://m.media-amazon.com/images/I/71Udwbkn3VL.jpg";

  return (
    <div className="col" style={{ width: "20rem" }}>
      <div className="card my-2">
        <img
          src={productImage || defaultImage}
          className="card-img-top"
          alt={productName || "immagine-prodotto"}
        />

        <div className="card-body">
          {badgeText && (
            <span className="badge bg-success p-2 mb-3">{badgeText}</span>
          )}

          {productPrice && <h5 className="h3 mb-3">€{productPrice}</h5>}

          {productName && <h5 className="card-title">{productName}</h5>}

          {productShortDescr && (
            <p className="card-text text-truncate">{productShortDescr}</p>
          )}

          <a href="#" className="btn btn-primary mb-4">
            Vai al prodotto
          </a>
        </div>
      </div>
    </div>
  );
}
