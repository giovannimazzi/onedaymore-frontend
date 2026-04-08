import { createContext, useContext, useMemo, useState } from "react";

const CompareContext = createContext();

function normalizeCompareProduct(product) {
  return {
    slug: product.slug,
    name: product.name,
    price: Number(product.price),
    image_url: product.image_url,
    category_name: product.category_name,
    category_slug: product.category_slug,
    short_description: product.short_description,
    description: product.description,
    brand: product.brand,
    weight_grams: product.weight_grams,
    servings: product.servings,
    calories: product.calories,
    storage_life_months: product.storage_life_months,
    preparation_type: product.preparation_type,
    water_needed_ml: product.water_needed_ml,
    quantity_available: product.quantity_available,
    total_sold: product.total_sold,
  };
}

export function CompareContextProvider({ children }) {
  const [compareItems, setCompareItems] = useState([]);

  const addToCompare = (product) => {
    const normalizedProduct = normalizeCompareProduct(product);

    setCompareItems((currentItems) => {
      const alreadyIncluded = currentItems.some(
        (item) => item.slug === normalizedProduct.slug,
      );

      if (alreadyIncluded) return currentItems;
      if (currentItems.length >= 3) return currentItems;

      return [...currentItems, normalizedProduct];
    });
  };

  const removeFromCompare = (productSlug) => {
    setCompareItems((currentItems) =>
      currentItems.filter((item) => item.slug !== productSlug),
    );
  };

  const toggleCompare = (product) => {
    const normalizedProduct = normalizeCompareProduct(product);

    setCompareItems((currentItems) => {
      const alreadyIncluded = currentItems.some(
        (item) => item.slug === normalizedProduct.slug,
      );

      if (alreadyIncluded) {
        return currentItems.filter(
          (item) => item.slug !== normalizedProduct.slug,
        );
      }

      if (currentItems.length >= 3) return currentItems;

      return [...currentItems, normalizedProduct];
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productSlug) => {
    return compareItems.some((item) => item.slug === productSlug);
  };

  const value = useMemo(
    () => ({
      compareItems,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
      isInCompare,
      isCompareFull: compareItems.length >= 3,
    }),
    [compareItems],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompareContext() {
  return useContext(CompareContext);
}
