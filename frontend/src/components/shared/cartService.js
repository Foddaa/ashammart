import Cookies from "js-cookie";

const CART_KEY = "cart";

export const getCart = () => {
  try {
    return JSON.parse(Cookies.get(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveCart = (cart) => {
  Cookies.set(CART_KEY, JSON.stringify(cart), { expires: 7 }); // store 7 days
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
};

export const updateCartItem = (productId, quantity) => {
  let cart = getCart();
  cart = cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
  saveCart(cart);
};

export const removeFromCart = (productId) => {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
};
export const clearCart = () => {
  Cookies.remove(CART_KEY);
};
