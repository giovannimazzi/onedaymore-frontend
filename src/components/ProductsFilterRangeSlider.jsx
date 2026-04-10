function snapToStep(value, step) {
  if (step >= 1) return Math.round(value / step) * step;
  const inv = Math.round(value / step);
  return Math.round(inv * step * 100) / 100;
}

function storeValue(n, step) {
  if (step >= 1) return String(Math.round(n));
  return String(Math.round(n * 100) / 100);
}

export default function ProductsFilterRangeSlider({
  label,
  minKey,
  maxKey,
  bounds,
  filters,
  setFilter,
  setFilters,
  formatSummary,
}) {
  const loB = bounds.min;
  const hiB = bounds.max;
  const step = bounds.step;

  const rawMin = filters[minKey];
  const rawMax = filters[maxKey];

  const nLo = rawMin === "" ? loB : Number(rawMin);
  const nHi = rawMax === "" ? hiB : Number(rawMax);

  let sLo = Math.max(loB, Math.min(hiB, Number.isFinite(nLo) ? nLo : loB));
  let sHi = Math.max(loB, Math.min(hiB, Number.isFinite(nHi) ? nHi : hiB));
  if (sLo > sHi) sHi = sLo;

  const onMinChange = (e) => {
    let x = snapToStep(Number(e.target.value), step);
    x = Math.max(loB, Math.min(hiB, x));
    const maxVal = rawMax === "" ? hiB : Number(rawMax);
    if (x > maxVal) {
      setFilters({
        [minKey]: x <= loB ? "" : storeValue(x, step),
        [maxKey]: x >= hiB ? "" : storeValue(x, step),
      });
    } else {
      setFilter(minKey, x <= loB ? "" : storeValue(x, step));
    }
  };

  const onMaxChange = (e) => {
    let x = snapToStep(Number(e.target.value), step);
    x = Math.max(loB, Math.min(hiB, x));
    const minVal = rawMin === "" ? loB : Number(rawMin);
    if (x < minVal) {
      setFilters({
        [maxKey]: x >= hiB ? "" : storeValue(x, step),
        [minKey]: x <= loB ? "" : storeValue(x, step),
      });
    } else {
      setFilter(maxKey, x >= hiB ? "" : storeValue(x, step));
    }
  };

  const summary = formatSummary(rawMin, rawMax, sLo, sHi, loB, hiB);

  return (
    <div className="products-filter-range mb-4">
      <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-2 mb-2">
        <p className="form-label mb-0">{label}</p>
        <span className="products-filter-range-summary small text-muted">
          {summary}
        </span>
      </div>
      <div className="products-range-dual" aria-hidden={false}>
        <input
          type="range"
          className="products-range products-range--min"
          min={loB}
          max={hiB}
          step={step}
          value={sLo}
          onChange={onMinChange}
          aria-label={`${label}: valore minimo`}
        />
        <input
          type="range"
          className="products-range products-range--max"
          min={loB}
          max={hiB}
          step={step}
          value={sHi}
          onChange={onMaxChange}
          aria-label={`${label}: valore massimo`}
        />
      </div>
    </div>
  );
}
