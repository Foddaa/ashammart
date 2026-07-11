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
    // e.g. storage quota exceeded / private-browsing restrictions
    console.error("Failed to save cart:", err);
  }
  triggerCartUpdate(); // Trigger event when cart is saved
};

/**
 * Reduce a full product object down to only what the cart needs to display
 * and check out. Keeps cart payload tiny and avoids caching stale
 * description/ratings/full-size image data inside the cart item.
 */
const toCartItem = (product, quantity) => ({
  id: product.id,
  name: product.name || product.title,
  price: product.price,
  canceledPrice: product.canceledPrice,
  code: product.code,
  image: product.images?.[0]?.url || null,
  quantity,
});

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push(toCartItem(product, quantity));
  }
  saveCart(cart);
  // triggerCartUpdate() is already called inside saveCart
};

export const updateCartItem = (productId, quantity) => {
  let cart = getCart();
  cart = cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
  saveCart(cart);
  // triggerCartUpdate() is already called inside saveCart
};

export const clearCart = () => {
  try {
    window.localStorage.removeItem(CART_KEY);
  } catch (err) {
    console.error("Failed to clear cart:", err);
  }
  triggerCartUpdate(); // Trigger event when cart is cleared
};

export const updateCartItemQuantity = (productId, newQuantity) => {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.id === productId);
  if (existingIndex !== -1) {
    if (newQuantity <= 0) {
      // remove if quantity becomes zero
      cart.splice(existingIndex, 1);
    } else {
      cart[existingIndex].quantity = newQuantity;
    }
    saveCart(cart);
    // triggerCartUpdate() is already called inside saveCart
  }
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const filtered = cart.filter((item) => item.id !== productId);
  saveCart(filtered);
  // triggerCartUpdate() is already called inside saveCart
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