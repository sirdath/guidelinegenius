"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "gg_admin_authed";
const USER_KEY = "gg_admin_user";

type AuthState = {
  authed: boolean;
  user: string | null;
  ready: boolean;
  login: (email?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState>({
  authed: false,
  user: null,
  ready: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setAuthed(localStorage.getItem(STORAGE_KEY) === "1");
      setUser(localStorage.getItem(USER_KEY));
    } catch {}
    setReady(true);
  }, []);

  function login(email?: string) {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
      if (email) localStorage.setItem(USER_KEY, email);
    } catch {}
    setAuthed(true);
    if (email) setUser(email);
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
    setAuthed(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ authed, user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
