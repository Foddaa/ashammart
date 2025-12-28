// src/utils/addToCartHelper.js
import { toast } from "react-toastify";

export const handleAddToCartHelper = async ({
  product,
  quantity = 1,
  comment = "",
  Token,
  navigate,
  location,
  background,
  setToken,
  handleClose, // optional callback
}) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Step 1: Check user auth
  try {
    const authCheckRes = await fetch(`${BASE_URL}/api/client`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });

    if (authCheckRes.status !== 200) {
      toast.warn("You must be logged in to add to cart.");
      navigate("/login", {
        state: {
          from: location.pathname,
          product,
          background,
          redirectReason: "add-to-cart",
        },
      });
      return;
    }
  } catch (err) {
    console.error("Auth check error:", err);
    toast.error("Could not verify authentication.");
    return;
  }

  // Step 2: Add to cart
  try {
    const response = await fetch(`${BASE_URL}/api/client/addToCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
      body: JSON.stringify({
        product,
        quantity,
        comments: comment,
      }),
    });

    if (response.ok) {
      toast.success("Product added to cart!");
      if (handleClose) handleClose(); // only if passed
    } else if (response.status === 401 || response.status === 403) {
      toast.warn("Session expired. Please log in again.");
      // setToken(null);
      navigate("/login");
    } else {
      toast.error("Failed to add product to cart.");
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    toast.error("An error occurred while adding to cart.");
  }
};
