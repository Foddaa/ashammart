import Cookies from "js-cookie";

const CART_KEY = "cart";

// Event name for cart updates
const CART_UPDATE_EVENT = "cartUpdated";

// Helper function to trigger cart update event
export const triggerCartUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT, { 
      detail: { cart: getCart() } 
    }));
  }
};

export const getCart = () => {
  try {
    return JSON.parse(Cookies.get(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  Cookies.set(CART_KEY, JSON.stringify(cart), { expires: 7 }); // store 7 days
  triggerCartUpdate(); // Trigger event when cart is saved
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
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
  Cookies.remove(CART_KEY);
  triggerCartUpdate(); // Trigger event when cart is cleared
};

export const updateCartItemQuantity = (productId, newQuantity) => {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);
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
  const filtered = cart.filter(item => item.id !== productId);
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