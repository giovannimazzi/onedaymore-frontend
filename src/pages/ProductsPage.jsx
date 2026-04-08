import { useEffect, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useLoaderContext } from '../contexts/LoaderContext';
import { useProductFilters } from '../hooks/useProductFilters';
import { useCategories } from '../hooks/useCategories';
import { getProductBadges } from '../utils/productBadges';
import ProductListItem from '../components/ProductListItem';

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Più recenti' },
  { value: 'name', label: 'Nome' },
  { value: 'price', label: 'Prezzo' },
  { value: 'calories', label: 'Calorie' },
  { value: 'weight_grams', label: 'Peso' },
  { value: 'servings', label: 'Porzioni' },
  { value: 'total_sold', label: 'Più venduti' },
];

const PREP_OPTIONS = [
  { value: '', label: 'Tutti i tipi' },
  { value: 'ready_to_eat', label: 'Pronto al consumo' },
  { value: 'add_hot_water', label: 'Acqua calda' },
  { value: 'add_cold_water', label: 'Acqua fredda' },
];

function getCardStat(product, sort) {
  switch (sort) {
    case 'calories':
      if (product.calories == null) return null;
      return { label: 'Kcal', value: `${product.calories}` };
    case 'weight_grams': {
      if (product.weight_grams == null) return null;
      const w = product.weight_grams;
      return {
        label: 'Peso',
        value: w >= 1000 ? `${(w / 1000).toFixed(1)} kg` : `${w} g`,
      };
    }
    case 'servings':
      if (product.servings == null) return null;
      return { label: 'Porzioni', value: `${product.servings}` };
    case 'total_sold':
      if (product.total_sold == null) return null;
      return { label: 'Venduti', value: `${product.total_sold}` };
    default:
      return null;
  }
}

export default function ProductsPage() {
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

  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const searchInputRef = useRef(null);

  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setSearchInput(filters.search ?? '');
  }, [filters.search]);

  useEffect(() => {
    if (isLoading) startLoading();
    else endLoading();
  }, [isLoading, startLoading, endLoading]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter('search', searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput('');
    clearFilters();
    searchInputRef.current?.focus();
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.preparation_type ||
    filters.min_price ||
    filters.max_price ||
    filters.sort !== 'created_at' ||
    filters.order !== 'desc';

  return (
    <div className="container-fluid my-4 products-page ps-0 pe-3 pe-md-4 pe-xxl-5">
      <div className="row mb-4">
        <div className="col-12 px-3 px-md-4 px-xxl-5">
          <div className="products-page-header d-flex flex-column flex-xl-row justify-content-between align-items-xl-end gap-3">
            <h1 className="mb-0">I nostri prodotti</h1>

            <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center">
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn ${
                    viewMode === 'grid'
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setViewMode('grid')}
                >
                  🔲 Griglia
                </button>
                <button
                  type="button"
                  className={`btn ${
                    viewMode === 'list'
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => setViewMode('list')}
                >
                  📋 Lista
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
        <aside className="col-12 col-lg-3 products-page-filters-col px-3 px-lg-0 pe-lg-0 mb-4 mb-lg-0">
          <form
            className="products-filters p-3 p-md-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <h2 className="h5 mb-3">Filtri</h2>

            <div className="mb-4">
              <p className="form-label mb-2">Categoria</p>
              <ul className="products-filter-list" role="list">
                <li>
                  <button
                    type="button"
                    className={`products-filter-option${filters.category === '' ? ' is-active' : ''}`}
                    onClick={() => setFilter('category', '')}
                  >
                    Tutte le categorie
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      type="button"
                      className={`products-filter-option${filters.category === cat.slug ? ' is-active' : ''}`}
                      onClick={() => setFilter('category', cat.slug)}
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
                      className={`products-filter-option${filters.preparation_type === opt.value ? ' is-active' : ''}`}
                      onClick={() => setFilter('preparation_type', opt.value)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
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
                  onChange={(e) => setFilter('min_price', e.target.value)}
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
                  onChange={(e) => setFilter('max_price', e.target.value)}
                  aria-label="Prezzo massimo"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="filter-sort">
                Ordina per
              </label>
              <select
                id="filter-sort"
                className="form-select products-filters-select"
                value={filters.sort}
                onChange={(e) => setFilter('sort', e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="filter-order">
                Direzione
              </label>
              <select
                id="filter-order"
                className="form-select products-filters-select"
                value={filters.order}
                onChange={(e) => setFilter('order', e.target.value)}
              >
                <option value="asc">↑ Crescente</option>
                <option value="desc">↓ Decrescente</option>
              </select>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              Rimuovi filtri
            </button>
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
                    onClick={() => setFilter('search', '')}
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
                    onClick={() => setFilter('category', '')}
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
                    onClick={() => setFilter('preparation_type', '')}
                    aria-label="Rimuovi filtro preparazione"
                  >
                    ×
                  </button>
                </span>
              )}
              {(filters.min_price || filters.max_price) && (
                <span className="products-filter-chip">
                  €{filters.min_price || '0'} – €{filters.max_price || '∞'}
                  <button
                    type="button"
                    className="products-filter-chip-remove"
                    onClick={() => setFilters({ min_price: '', max_price: '' })}
                    aria-label="Rimuovi filtro prezzo"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          <div
            className={
              viewMode === 'grid'
                ? 'row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-4 gx-4 gy-0 products-page-grid my-0'
                : 'products-page-list d-flex flex-column gap-3 my-0'
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
                      {' '}
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
              return viewMode === 'grid' ? (
                <ProductCard
                  key={product.slug}
                  productName={product.name}
                  productImage={product.image_url}
                  productCategorySlug={product.category_slug}
                  productQuantityAvailable={product.quantity_available}
                  badges={productBadges}
                  productPrice={product.price}
                  productLink={
                    product.slug ? `/products/${product.slug}` : '/products'
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
                    product.slug ? `/products/${product.slug}` : '/products'
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
