// src/services/favoriteService.js
import api from "@/api/axiosInstance";

export const addFavorite = (productId) =>
  api.post(`/api/favorites/add/${productId}`);

export const removeFavorite = (productId) =>
  api.delete(`/api/favorites/remove/${productId}`);

export const checkFavorite = (productId) =>
  api.get(`/api/favorites/check/${productId}`);