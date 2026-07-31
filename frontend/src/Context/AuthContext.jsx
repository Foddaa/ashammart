import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import api, { setAccessToken, registerTokenChangeHandler } from "@/api/axiosInstance";

export const UserContext = createContext(null);

// Minimal JWT payload decoder — avoids adding a dependency just for this.
// NOT for verifying the token (the browser can't verify a signature safely
// anyway); only used to read the "role" claim for UI purposes. The backend
// remains the source of truth and re-checks the token on every request.
function decodeJwtPayload(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const json = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return JSON.parse(json);
}

export function AuthProvider({ children }) {
  const [Token, setTokenState] = useState(null);
  const [ready, setReady] = useState(false); // true once the initial silent-refresh attempt finishes

  // Derived from the token itself (never stored separately) so it can't
  // drift out of sync with whatever role the token actually grants.
  const role = useMemo(() => {
    if (!Token) return null;
    try {
      return decodeJwtPayload(Token).role ?? null;
    } catch {
      return null;
    }
  }, [Token]);

  // Keep React state mirrored whenever the axios module updates the in-memory token
  useEffect(() => {
    registerTokenChangeHandler((token) => setTokenState(token));
  }, []);

  const setToken = useCallback((token) => {
    setAccessToken(token);
    setTokenState(token);
  }, []);

  // On app load: exchange the HttpOnly refresh cookie (if present & valid)
  // for a fresh access token, so the user stays logged in across reloads
  // without the access token ever touching disk.
  useEffect(() => {
    api
      .post("/api/auth/refresh")
      .then((res) => setToken(res.data.token))
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, [setToken]);

  const login = async (email, password) => {
    // refreshToken cookie is set automatically by the Set-Cookie header;
    // we only ever handle the access token on the client.
    const res = await api.post("/api/auth/login", { email, password });
    setToken(res.data.body.token);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout"); // clears the refresh cookie server-side, see note below
    } catch {
      // even if the network call fails, still clear client-side state
    }
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ Token, setToken, ready, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}