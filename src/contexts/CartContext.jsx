import { createContext, useContext, useState } from "react";
import { useEffect } from "react";

const CartContext = createContext();

function migrateCartLinesFromStorage(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((line) => {
      const slug = line.slug ?? line.id;
      if (slug == null || slug === "") return null;
      const { id: _legacyId, ...rest } = line;
      return { ...rest, slug };
    })
    .filter(Boolean);
}

export function CartContextProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    if (!saved) return [];
    try {
      return migrateCartLinesFromStorage(JSON.parse(saved));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingLine = prev.find((line) => line.slug === product.slug);

      if (existingLine) {
        return prev.map((line) =>
          line.slug === product.slug
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productSlug) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.slug !== productSlug) return item;
        if (
          item.quantity_available != null &&
          item.quantity >= item.quantity_available
        ) {
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      }),
    );
  };

  const decreaseQuantity = (productSlug) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.slug === productSlug
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productSlug) => {
    setCart((prev) => prev.filter((line) => line.slug !== productSlug));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
