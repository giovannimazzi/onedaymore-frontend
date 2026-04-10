import { Link } from "react-router";
import { useCompareContext } from "../contexts/CompareContext";
import ProductImage from "../components/ProductImage";

const compareRows = [
  {
    label: "Categoria",
    key: "category_name",
    formatValue: (value) => value || "—",
  },
  {
    label: "Descrizione",
    key: "short_description",
    formatValue: (value) => value || "—",
  },
  {
    label: "Brand",
    key: "brand",
    formatValue: (value) => value || "—",
  },
  {
    label: "Prezzo",
    key: "price",
    formatValue: (value) =>
      value != null ? `€${Number(value).toFixed(2)}` : "—",
  },
  {
    label: "Peso",
    key: "weight_grams",
    formatValue: (value) => (value != null ? `${value} g` : "—"),
  },
  {
    label: "Porzioni",
    key: "servings",
    formatValue: (value) => (value != null ? value : "—"),
  },
  {
    label: "Calorie",
    key: "calories",
    formatValue: (value) => (value != null ? `${value} kcal` : "—"),
  },
  {
    label: "Conservazione",
    key: "storage_life_months",
    formatValue: (value) => (value != null ? `${value} mesi` : "—"),
  },
  {
    label: "Preparazione",
    key: "preparation_type",
    formatValue: (value) =>
      value
        ? value
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "—",
  },
  {
    label: "Acqua necessaria",
    key: "water_needed_ml",
    formatValue: (value) => (value != null ? `${value} ml` : "—"),
  },
];

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompareContext();

  const hasItems = compareItems.length > 0;
  const hasEnoughItemsToCompare = compareItems.length >= 2;

  if (!hasItems) {
    return (
      <section className="container py-5">
        <div className="compare-page-empty text-center">
          <h1 className="mb-3">Confronta prodotti</h1>
          <p className="mb-4">Non hai ancora aggiunto prodotti al confronto.</p>

          <div>
            <h2 className="h3 mb-3">Non sai come aggiungerli? Scoprilo qui</h2>
            <p>
              Per ogni singolo prodotto è possibile vedere{" "}
              <b>in alto a destra </b>per ogni card l'icona
              <span
                class="product-card-compare-toggle__icon mx-2"
                aria-hidden="true"
              >
                <i class="bi bi-arrow-left-right"></i>
              </span>
              selezionandola, potrai <b>aggiungere il prodotto al confronto </b>
              fino ad un <b>massimo di 3 prodotti da confrontare </b> ed
              appariranno in questa sezione.
            </p>
          </div>
          <Link to="/products" className="btn btn-primary">
            Vai ai prodotti
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="compare-page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="mb-1">Confronta prodotti</h1>
          <p className="mb-0 text-muted">
            {compareItems.length}/3 prodotti selezionati
          </p>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2">
          <Link to="/products" className="btn btn-secondary">
            Vai ai prodotti
          </Link>

          <button
            type="button"
            className="btn btn-danger"
            onClick={clearCompare}
          >
            Svuota confronto
          </button>
        </div>
      </div>

      {!hasEnoughItemsToCompare && (
        <div className="alert alert-info mb-4" role="alert">
          Hai selezionato un solo prodotto. Aggiungine almeno un altro per
          confrontarli.
        </div>
      )}

      <div className="table-responsive">
        <table className="table align-middle compare-table">
          <thead>
            <tr>
              <th scope="col" className="compare-table__label-col"></th>

              {compareItems.map((product) => (
                <th
                  scope="col"
                  key={product.slug}
                  className="compare-table__product-col"
                >
                  <div className="compare-table__product-header">
                    <div className="mx-auto">
                      <Link
                        to={`/products/${product.slug}`}
                        className="compare-table__image-link d-inline-block mb-3"
                      >
                        <ProductImage
                          src={product.image_url}
                          categorySlug={product.category_slug}
                          alt={product.name}
                          className="compare-table__image"
                        />
                      </Link>
                      <Link
                        to={`/products/${product.slug}`}
                        className="compare-table__product-name d-block mb-2"
                      >
                        {product.name}
                      </Link>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => removeFromCompare(product.slug)}
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {compareRows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>

                {compareItems.map((product) => (
                  <td key={`${row.key}-${product.slug}`}>
                    {row.formatValue(product[row.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
