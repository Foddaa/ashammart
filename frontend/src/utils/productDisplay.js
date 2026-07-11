const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Transparent gray square used whenever a product has no image / image fails to load
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20'/%3E%3C/svg%3E";

/** Full image URL for the product's first image, or the placeholder. */
export function getProductImageUrl(product) {
  return product?.images?.[0]?.url
    ? `${BASE_URL}/api${product.images[0].url}`
    : PLACEHOLDER_IMAGE;
}

/**
 * The "was" price shown with a strikethrough.
 * Uses product.canceledPrice if it's a real discount, otherwise fabricates
 * one at +12% so every card always shows a "was" price.
 */
export function getDisplayCanceledPrice(product) {
  if (!product) return 0;
  return !product.canceledPrice || product.canceledPrice <= product.price
    ? Math.round(product.price * 1.12)
    : product.canceledPrice;
}

/** Truncate a description to maxLength chars, adding "..." if cut. */
export function getTruncatedDescription(description, maxLength = 30) {
  if (!description) return "";
  return description.length > maxLength
    ? `${description.substring(0, maxLength)}...`
    : description;
}
