import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import axios from "axios";
import { productsEndpoint } from "../utils/api";

function parseParams(searchParams) {
  const readParam = (key) => searchParams.get(key) ?? "";
  return {
    search: readParam("search"),
    category: readParam("category"),
    sort: readParam("sort") || "created_at",
    order: readParam("order") || "desc",
    preparation_type: readParam("preparation_type"),
    min_price: readParam("min_price"),
    max_price: readParam("max_price"),
    min_calories: readParam("min_calories"),
    max_calories: readParam("max_calories"),
    min_weight_grams: readParam("min_weight_grams"),
    max_weight_grams: readParam("max_weight_grams"),
    min_servings: readParam("min_servings"),
    max_servings: readParam("max_servings"),
  };
}

function buildAxiosParams(filters) {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params[key] = value;
    }
  });
  return params;
}

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseParams(searchParams);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const abortRef = useRef(null);

  const fetchProducts = useCallback((currentFilters) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setHasError(false);

    axios
      .get(productsEndpoint, {
        params: buildAxiosParams(currentFilters),
        signal: abortRef.current.signal,
      })
      .then((response) => {
        setProducts(response.data.result ?? []);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const setFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === "" || value == null) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const setFilters = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === "" || value == null) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return { products, isLoading, hasError, filters, setFilter, setFilters, clearFilters };
}
