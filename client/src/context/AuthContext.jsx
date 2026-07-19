import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./auth-context.js";
import { STORAGE_KEYS } from "../utils/constants.js";

const getStoredSession = () => {
  try {
    const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(getStoredSession);

  useEffect(() => {
    try {
      if (session?.member) {
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
        return;
      }

      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch {
      return undefined;
    }

    return undefined;
  }, [session]);

  const login = useCallback((member, group) => {
    const nextSession = group === undefined && member?.member
      ? member
      : { member, group };

    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      member: session?.member ?? null,
      group: session?.group ?? null,
      isAuthenticated: Boolean(session?.member),
      login,
      logout,
    }),
    [login, logout, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
