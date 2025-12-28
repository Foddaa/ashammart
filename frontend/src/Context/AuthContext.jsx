import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [Token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [ready, setReady] = useState(false); // ✅ new flag

 useEffect(() => {
  const savedToken = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");

  if (savedToken) setToken(savedToken);
  if (savedRole) setUserRole(savedRole);

  setReady(true); // ✅ super important
}, []);

  return (
    <UserContext.Provider
      value={{ Token, setToken, userRole, setUserRole, ready }}
    >
      {children}
    </UserContext.Provider>
  );
}
