import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { productsAvailabilityEndpoint } from "../utils/api";
import { useNotificationContext } from "./NotificationContext";
import {
  mergeAvailabilityIntoCart,
  diffAvailabilityChanges,
  buildAvailabilityNotice,
} from "../utils/cartAvailabilitySync";

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
  const { showNotification } = useNotificationContext();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    if (!saved) return [];
    try {
      return migrateCartLinesFromStorage(JSON.parse(saved));
    } catch {
      return [];
    }
  });

  const cartRef = useRef(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const refreshCartAvailability = useCallback(
    async (options = {}) => {
      const { silent = false } = options;
      const lines = cartRef.current;
      if (lines.length === 0) return undefined;

      try {
        const { data } = await axios.post(productsAvailabilityEndpoint, {
          items: lines.map((line) => ({
            slug: line.slug,
            quantity: line.quantity,
          })),
        });
        const rows = data?.result;
        if (!Array.isArray(rows)) return undefined;

        let merged;
        let changes = [];

        setCart((prev) => {
          merged = mergeAvailabilityIntoCart(prev, rows);
          changes = diffAvailabilityChanges(prev, merged);
          return merged;
        });

        let notified = false;
        const noticeMessage =
          changes.length > 0
            ? buildAvailabilityNotice(changes, merged.length === 0)
            : null;

        if (!silent && noticeMessage) {
          showNotification(noticeMessage, "warning", {
            duration: merged.length === 0 ? 6200 : 5200,
            pointer: "cart",
          });
          notified = true;
        }

        return {
          cart: merged,
          notified,
          changed: changes.length > 0,
          noticeMessage,
        };
      } catch {
        return undefined;
      }
    },
    [showNotification],
  );

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

  const restoreCartLine = useCallback((line) => {
    if (!line?.slug) return;
    setCart((prev) => {
      const rest = prev.filter((l) => l.slug !== line.slug);
      return [...rest, { ...line }];
    });
  }, []);

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        restoreCartLine,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        refreshCartAvailability,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
