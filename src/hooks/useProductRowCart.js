import { useMemo, useState, useCallback } from "react";
import { useCartContext } from "../contexts/CartContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useAvailability } from "./useAvailability";
import { getCategoryFallbackImage } from "../utils/productImage";
import {
  getProductSlugFromLink,
  formatProductMoney,
  formatProductListPrice,
} from "../utils/productDisplay";

export function useProductRowCart({
  cartLine,
  product,
  productPrice,
  productLink,
}) {
  const isCart = cartLine != null;

  const {
    cart,
    addToCart,
    removeFromCart,
    restoreCartLine,
    increaseQuantity,
    decreaseQuantity,
  } = useCartContext();
  const { showNotification } = useNotificationContext();

  const slug = isCart
    ? cartLine.slug
    : product?.slug ?? getProductSlugFromLink(productLink);
  const name = isCart ? cartLine.name : product?.name;
  const destination = isCart
    ? `/products/${cartLine.slug}`
    : productLink || "/products";
  const categorySlug = isCart ? cartLine.category_slug : product?.category_slug;
  const rawImageUrl = isCart ? cartLine.image_url : product?.image_url;
  const availabilitySlug = isCart ? cartLine.slug : product?.slug;

  const cartItem = useMemo(
    () => (slug ? cart.find((l) => l.slug === slug) : undefined),
    [cart, slug],
  );

  const availableStock = isCart
    ? cartLine.quantity_available
    : product?.quantity_available ?? cartItem?.quantity_available ?? null;

  const quantityInCart = isCart ? cartLine.quantity : (cartItem?.quantity ?? 0);

  const { isOutOfStock } = useAvailability(availableStock, quantityInCart);

  const fallbackImage = getCategoryFallbackImage(categorySlug);
  const [imageSrc, setImageSrc] = useState(
    () => rawImageUrl || fallbackImage,
  );

  const notifyCartLineRemovedWithUndo = useCallback(
    (snapshot) => {
      const label =
        (snapshot.name && String(snapshot.name).trim()) || "Prodotto";
      showNotification(`${label} rimosso dal carrello`, "muted", {
        duration: 8000,
        pointer: "cart",
        action: {
          label: "Annulla",
          onAction: () => restoreCartLine(snapshot),
        },
      });
    },
    [showNotification, restoreCartLine],
  );

  const handleDecrease = useCallback(() => {
    if (isCart) {
      if (cartLine.quantity <= 1) {
        notifyCartLineRemovedWithUndo({ ...cartLine });
      }
      decreaseQuantity(cartLine.slug);
      return;
    }
    if (!slug || !cartItem) return;
    if (cartItem.quantity <= 1) {
      const label = (name && String(name).trim()) || "Prodotto";
      showNotification(`${label} rimosso dal carrello`, "muted", {
        duration: 3200,
        pointer: "cart",
      });
    }
    decreaseQuantity(slug);
  }, [
    isCart,
    cartLine,
    slug,
    cartItem,
    name,
    decreaseQuantity,
    notifyCartLineRemovedWithUndo,
    showNotification,
  ]);

  const handleRemove = useCallback(() => {
    if (!isCart) return;
    notifyCartLineRemovedWithUndo({ ...cartLine });
    removeFromCart(cartLine.slug);
  }, [isCart, cartLine, notifyCartLineRemovedWithUndo, removeFromCart]);

  const handleAddToCart = useCallback(() => {
    if (isCart) return;
    const canAdd = Boolean(slug && name) && !isOutOfStock;
    if (!canAdd) return;
    addToCart({
      slug,
      name,
      price: Number(productPrice),
      image_url: rawImageUrl || imageSrc,
      category_slug: categorySlug,
      quantity_available: availableStock,
    });
    showNotification("Prodotto aggiunto al carrello!", "success", {
      duration: 3200,
      pointer: "cart",
    });
  }, [
    isCart,
    slug,
    name,
    isOutOfStock,
    addToCart,
    productPrice,
    rawImageUrl,
    imageSrc,
    categorySlug,
    availableStock,
    showNotification,
  ]);

  const priceLabel = isCart
    ? `€${formatProductMoney(cartLine.price * cartLine.quantity)}`
    : productPrice != null && productPrice !== ""
      ? `€${formatProductListPrice(productPrice)}`
      : "—";

  return {
    isCart,
    slug,
    name,
    destination,
    categorySlug,
    rawImageUrl,
    imageSrc,
    setImageSrc,
    availabilitySlug,
    cartItem,
    availableStock,
    quantityInCart,
    isOutOfStock,
    handleDecrease,
    handleRemove,
    handleAddToCart,
    increaseQuantity,
    decreaseQuantity,
    priceLabel,
  };
}
