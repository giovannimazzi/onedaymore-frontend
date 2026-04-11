import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useLoaderContext } from "../contexts/LoaderContext";
import { useProductFilters } from "../hooks/useProductFilters";
import { useCategories } from "../hooks/useCategories";
import { getProductBadges } from "../utils/productBadges";
import ProductListItem from "../components/ProductListItem";

const SORT_OPTIONS = [
  { value: "created_at", label: "Più recenti" },
  { value: "name", label: "Nome" },
  { value: "price", label: "Prezzo" },
  { value: "calories", label: "Calorie" },
  { value: "weight_grams", label: "Peso" },
  { value: "servings", label: "Porzioni" },
  { value: "storage_life_months", label: "Conservazione" },
  { value: "water_needed_ml", label: "Acqua necessaria" },
  { value: "total_sold", label: "Più venduti" },
];

const PREP_OPTIONS = [
  { value: "", label: "Tutti i tipi" },
  { value: "ready_to_eat", label: "Pronto al consumo" },
  { value: "add_hot_water", label: "Acqua calda" },
  { value: "add_cold_water", label: "Acqua fredda" },
];

const RANGE_FILTERS = [
  {
    label: "Calorie (kcal)",
    minKey: "min_calories",
    maxKey: "max_calories",
    chipLabel: "Calorie",
    unit: "kcal",
    step: 1,
    min: 0,
  },
  {
    label: "Peso netto (g)",
    minKey: "min_weight_grams",
    maxKey: "max_weight_grams",
    chipLabel: "Peso",
    unit: "g",
    step: 1,
    min: 0,
  },
  {
    label: "Porzioni",
    minKey: "min_servings",
    maxKey: "max_servings",
    chipLabel: "Porzioni",
    unit: "",
    step: 1,
    min: 0,
  },
  {
    label: "Conservazione (mesi)",
    minKey: "min_storage_life_months",
    maxKey: "max_storage_life_months",
    chipLabel: "Conservazione",
    unit: "mesi",
    step: 1,
    min: 0,
  },
  {
    label: "Acqua necessaria (ml)",
    minKey: "min_water_needed_ml",
    maxKey: "max_water_needed_ml",
    chipLabel: "Acqua",
    unit: "ml",
    step: 1,
    min: 0,
  },
];

function getCardStat(product, sort) {
  switch (sort) {
    case "calories":
      if (product.calories == null) return null;
      return { label: "Kcal", value: `${product.calories}` };
    case "weight_grams": {
      if (product.weight_grams == null) return null;
      const w = product.weight_grams;
      return {
        label: "Peso",
        value: w >= 1000 ? `${(w / 1000).toFixed(1)} kg` : `${w} g`,
      };
    }
    case "servings":
      if (product.servings == null) return null;
      return { label: "Porzioni", value: `${product.servings}` };
    case "storage_life_months":
      if (product.storage_life_months == null) return null;
      return {
        label: "Conserv.",
        value: `${product.storage_life_months} mesi`,
      };
    case "water_needed_ml":
      if (product.water_needed_ml == null) return null;
      return {
        label: "Acqua",
        value: `${product.water_needed_ml} ml`,
      };
    case "total_sold":
      if (product.total_sold == null) return null;
      return { label: "Venduti", value: `${product.total_sold}` };
    default:
      return null;
  }
}

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const { startLoading, endLoading } = useLoaderContext();
  const {
    products,
    isLoading,
    hasError,
    filters,
    setFilter,
    setFilters,
    clearFilters,
  } = useProductFilters();
  const { categories } = useCategories();

  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const searchInputRef = useRef(null);

  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    setSearchInput(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    if (isLoading) startLoading();
    else endLoading();
  }, [isLoading, startLoading, endLoading]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter("search", searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput("");
    clearFilters();
    searchInputRef.current?.focus();
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.preparation_type ||
    filters.min_price ||
    filters.max_price ||
    filters.min_calories ||
    filters.max_calories ||
    filters.min_weight_grams ||
    filters.max_weight_grams ||
    filters.min_servings ||
    filters.max_servings ||
    filters.min_storage_life_months ||
    filters.max_storage_life_months ||
    filters.min_water_needed_ml ||
    filters.max_water_needed_ml ||
    filters.min_quantity_available ||
    filters.max_quantity_available ||
    filters.sort !== "created_at" ||
    filters.order !== "desc";

  return (
    <div className="container-fluid my-4 products-page ps-0 pe-3 pe-md-4 pe-xxl-5">
      <div className="row mb-4">
        <div className="col-12 px-3 px-md-4 px-xxl-5">
          <div className="products-page-header d-flex flex-column flex-xl-row justify-content-between align-items-xl-end gap-3">
            <h1 className="mb-0">I nostri prodotti</h1>

            <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center">
              <div
                className="btn-group"
                role="group"
                aria-label="Visualizzazione prodotti"
              >
                <button
                  type="button"
                  className={`btn btn-outline-dark ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Visualizzazione a griglia"
                >
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-dark ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="Visualizzazione a lista"
                >
                  <i className="bi bi-list-ul"></i>
                </button>
              </div>

              <form
                className="products-search d-flex flex-column flex-sm-row gap-2"
                onSubmit={handleSearchSubmit}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  className="form-control"
                  placeholder="Cerca prodotto..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Cerca
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row gx-0 gy-0 align-items-start products-page-main">
        <div className="d-lg-none mb-3 px-3">
          <button
            className="btn btn-outline-dark w-100"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <i className="bi bi-funnel me-2"></i>
            Filtri
          </button>
        </div>

        <aside
          className={`col-12 col-lg-3 products-page-filters-col px-3 px-lg-0 pe-lg-0 mb-4 mb-lg-0 
    ${showFilters ? "d-block" : "d-none d-lg-block"}`}
        >
          <form
            className="products-filters p-3 p-md-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="products-filters-header d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <h2 className="h5 mb-0">Filtri</h2>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm flex-shrink-0"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
              >
                Rimuovi filtri
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-secondary d-lg-none"
                onClick={() => setShowFilters(false)}
              >
                Chiudi
              </button>
            </div>

            <div className="mb-4">
              <p className="form-label mb-2">Categoria</p>
              <ul className="products-filter-list" role="list">
                <li>
                  <button
                    type="button"
                    className={`products-filter-option${filters.category === "" ? " is-active" : ""}`}
                    onClick={() => setFilter("category", "")}
                  >
                    Tutte le categorie
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      type="button"
                      className={`products-filter-option${filters.category === cat.slug ? " is-active" : ""}`}
                      onClick={() => setFilter("category", cat.slug)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <p className="form-label mb-2">Preparazione</p>
              <ul className="products-filter-list" role="list">
                {PREP_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`products-filter-option${filters.preparation_type === opt.value ? " is-active" : ""}`}
                      onClick={() => setFilter("preparation_type", opt.value)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <p className="form-label mb-2">Disponibilità</p>
              <label className="products-filter-checkbox">
                <input
                  type="checkbox"
                  className="products-filter-checkbox-input"
                  checked={filters.min_quantity_available === "1"}
                  onChange={(e) =>
                    setFilter(
                      "min_quantity_available",
                      e.target.checked ? "1" : "",
                    )
                  }
                />
                <span className="products-filter-checkbox-label">
                  Mostra solo disponibili
                </span>
              </label>
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="filter-sort">
                Ordina per
              </label>
              <div className="products-filters-sort-row d-flex align-items-stretch gap-2">
                <select
                  id="filter-sort"
                  className="form-select products-filters-select products-filters-sort-select"
                  value={filters.sort}
                  onChange={(e) => setFilter("sort", e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-outline-secondary products-filters-order-toggle"
                  onClick={() =>
                    setFilter("order", filters.order === "asc" ? "desc" : "asc")
                  }
                  title={
                    filters.order === "asc"
                      ? "Passa a ordine decrescente"
                      : "Passa a ordine crescente"
                  }
                  aria-label={
                    filters.order === "asc"
                      ? "Ordine crescente, passa a decrescente"
                      : "Ordine decrescente, passa a crescente"
                  }
                >
                  {filters.order === "asc" ? (
                    <>
                      <i className="bi bi-sort-up" aria-hidden />
                      <span>Crescente</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-sort-down" aria-hidden />
                      <span>Decrescente</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="form-label mb-2">Prezzo (€)</p>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  className="form-control products-filters-input"
                  placeholder="Min"
                  min={0}
                  step="0.01"
                  value={filters.min_price}
                  onChange={(e) => setFilter("min_price", e.target.value)}
                  aria-label="Prezzo minimo"
                />
                <span className="products-filters-range-separator">—</span>
                <input
                  type="number"
                  className="form-control products-filters-input"
                  placeholder="Max"
                  min={0}
                  step="0.01"
                  value={filters.max_price}
                  onChange={(e) => setFilter("max_price", e.target.value)}
                  aria-label="Prezzo massimo"
                />
              </div>
            </div>

            {RANGE_FILTERS.map(({ label, minKey, maxKey, step, min }) => (
              <div key={minKey} className="mb-4">
                <p className="form-label mb-2">{label}</p>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="number"
                    className="form-control products-filters-input"
                    placeholder="Min"
                    min={min}
                    step={step}
                    value={filters[minKey]}
                    onChange={(e) => setFilter(minKey, e.target.value)}
                    aria-label={`${label} minimo`}
                  />
                  <span className="products-filters-range-separator">—</span>
                  <input
                    type="number"
                    className="form-control products-filters-input"
                    placeholder="Max"
                    min={min}
                    step={step}
                    value={filters[maxKey]}
                    onChange={(e) => setFilter(maxKey, e.target.value)}
                    aria-label={`${label} massimo`}
                  />
                </div>
              </div>
            ))}
          </form>
        </aside>
        <section className="col-12 col-lg-9 products-page-section ps-lg-4">
          {hasActiveFilters && (
            <div className="products-active-filters mb-3">
              {filters.search && (
                <span className="products-filter-chip">
                  Ricerca: <strong>{filters.search}</strong>
                  <button
                    type="button"
                    className="products-filter-chip-remove"
                    onClick={() => setFilter("search", "")}
                    aria-label="Rimuovi filtro ricerca"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="products-filter-chip">
                  {categories.find((c) => c.slug === filters.category)?.name ??
                    filters.category}
                  <button
                    type="button"
                    className="products-filter-chip-remove"
                    onClick={() => setFilter("category", "")}
                    aria-label="Rimuovi filtro categoria"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.preparation_type && (
                <span className="products-filter-chip">
                  {PREP_OPTIONS.find(
                    (p) => p.value === filters.preparation_type,
                  )?.label ?? filters.preparation_type}
                  <button
                    type="button"
                    className="products-filter-chip-remove"
                    onClick={() => setFilter("preparation_type", "")}
                    aria-label="Rimuovi filtro preparazione"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.min_quantity_available === "1" && (
                <span className="products-filter-chip">
                  Solo disponibili
                  <button
                    type="button"
                    className="products-filter-chip-remove"
                    onClick={() => setFilter("min_quantity_available", "")}
                    aria-label="Rimuovi filtro solo disponibili"
                  >
                    ×
                  </button>
                </span>
              )}
              {(filters.min_price || filters.max_price) && (
                <span className="products-filter-chip">
                  €{filters.min_price || "0"} – €{filters.max_price || "∞"}
                  <button
                    type="button"
                    className="products-filter-chip-remove"
                    onClick={() =>
                      setFilters({
                        min_price: "",
                        max_price: "",
                      })
                    }
                    aria-label="Rimuovi filtro prezzo"
                  >
                    ×
                  </button>
                </span>
              )}
              {RANGE_FILTERS.map(({ minKey, maxKey, chipLabel, unit }) => {
                const hasMin = Boolean(filters[minKey]);
                const hasMax = Boolean(filters[maxKey]);
                if (!hasMin && !hasMax) return null;
                const lo = filters[minKey] || "—";
                const hi = filters[maxKey] || "—";
                const suffix = unit ? ` ${unit}` : "";
                return (
                  <span key={minKey} className="products-filter-chip">
                    {chipLabel}: {lo} – {hi}
                    {suffix}
                    <button
                      type="button"
                      className="products-filter-chip-remove"
                      onClick={() =>
                        setFilters({
                          [minKey]: "",
                          [maxKey]: "",
                        })
                      }
                      aria-label={`Rimuovi filtro ${chipLabel.toLowerCase()}`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <div
            className={
              viewMode === "grid"
                ? "row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-4 gx-4 gy-0 products-page-grid my-0"
                : "products-page-list d-flex flex-column gap-3 my-0"
            }
          >
            {hasError && (
              <div className="col-12">
                <p className="text-center fs-5 py-4">
                  Non siamo riusciti a caricare i prodotti.
                </p>
              </div>
            )}
            {!hasError && !isLoading && products.length === 0 && (
              <div className="col-12">
                <p className="text-center fs-5 py-4">
                  Nessun prodotto trovato.
                  {hasActiveFilters && (
                    <>
                      {" "}
                      <button
                        type="button"
                        className="btn btn-link p-0 align-baseline"
                        onClick={handleClearFilters}
                      >
                        Rimuovi i filtri
                      </button>
                    </>
                  )}
                </p>
              </div>
            )}
            {products.map((product) => {
              const productBadges = getProductBadges(product);
              const cardStatFromSort = getCardStat(product, filters.sort);
              return viewMode === "grid" ? (
                <ProductCard
                  key={product.slug}
                  productName={product.name}
                  productImage={product.image_url}
                  productCategorySlug={product.category_slug}
                  productQuantityAvailable={product.quantity_available}
                  compareProduct={product}
                  badges={productBadges}
                  productPrice={product.price}
                  productLink={
                    product.slug ? `/products/${product.slug}` : "/products"
                  }
                  statLabel={cardStatFromSort?.label}
                  statValue={cardStatFromSort?.value}
                />
              ) : (
                <ProductListItem
                  key={product.slug}
                  product={product}
                  badges={productBadges}
                  productPrice={product.price}
                  productLink={
                    product.slug ? `/products/${product.slug}` : "/products"
                  }
                  statLabel={cardStatFromSort?.label}
                  statValue={cardStatFromSort?.value}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
