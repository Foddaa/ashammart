import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Access token lives in memory ONLY — never localStorage/sessionStorage.
// It's lost on page reload by design; AuthContext re-fetches it on mount
// via the HttpOnly refresh cookie.
let accessToken = null;
let onTokenChange = null; // lets AuthContext mirror this into React state

export const setAccessToken = (token) => {
  accessToken = token;
  if (onTokenChange) onTokenChange(token);
};

export const getAccessToken = () => accessToken;

export const registerTokenChangeHandler = (handler) => {
  onTokenChange = handler;
};

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends the HttpOnly refreshToken cookie automatically
});

// Attach the access token to every request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// On a 401, try ONE silent refresh, retry the original request, and make sure
// concurrent 401s only trigger a single refresh call (not one per request).
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${BASE_URL}/api/auth/refresh`, {}, { withCredentials: true })
            .then((res) => {
              setAccessToken(res.data.token);
              return res.data.token;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null); // refresh cookie is gone/expired — force logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
