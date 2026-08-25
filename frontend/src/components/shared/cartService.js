const CART_KEY = "cart";

// Event name for cart updates
const CART_UPDATE_EVENT = "cartUpdated";

// Helper function to trigger cart update event
export const triggerCartUpdate = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT, {
      detail: { cart: getCart() },
    }));
  }
};

export const getCart = () => {
  try {
    if (typeof window === "undefined") return [];
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Failed to save cart:", err);
  }
  triggerCartUpdate(); // Trigger event when cart is saved
};

/**
 * Reduce a full product and variant object down to only what the cart needs
 */
const toCartItem = (product, variant, quantity) => ({
  id: product.id, // Keep product ID for product-level operations
  variantId: variant.id, // Variant ID
  sku: variant.sku, // Save the SKU
  name: product.name || product.title,
  price: variant.price ?? product.price,
  canceledPrice: variant.canceledPrice ?? product.canceledPrice,
  code: product.code,
  image: product.images?.find(img => img.color?.id === variant.colorId)?.url || product.images?.[0]?.url || null,
  color: variant.colorName,
  size: variant.sizeName,
  quantity,
});

/**
 * Adds to cart locally, saving the SKU and variant ID.
 */
export const addToCart = (product, variant, quantity) => {
  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.variantId === variant.id);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push(toCartItem(product, variant, quantity));
  }

  saveCart(cart);
  // Note: If you need to sync this with the backend as well, add the API call here.
};

export const updateCartItem = (variantId, quantity) => {
  let cart = getCart();
  cart = cart.map((item) =>
    item.variantId === variantId ? { ...item, quantity } : item
  );
  saveCart(cart);
};

export const clearCart = () => {
  try {
    window.localStorage.removeItem(CART_KEY);
  } catch (err) {
    console.error("Failed to clear cart:", err);
  }
  triggerCartUpdate();
};

export const updateCartItemQuantity = (variantId, newQuantity) => {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.variantId === variantId);
  if (existingIndex !== -1) {
    if (newQuantity <= 0) {
      cart.splice(existingIndex, 1);
    } else {
      cart[existingIndex].quantity = newQuantity;
    }
    saveCart(cart);
  }
};

export const removeFromCart = (variantId) => {
  const cart = getCart();
  const filtered = cart.filter((item) => item.variantId !== variantId);
  saveCart(filtered);
};

// Optional: Get total items count
export const getCartItemCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 0), 0);
};

// Optional: Get total price
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity || 0), 0);
};