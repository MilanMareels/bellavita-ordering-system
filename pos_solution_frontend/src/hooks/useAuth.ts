import { useState } from "react";
import type { UserProfile } from "../types";

//const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("pos_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loginError, setLoginError] = useState("");

  const login = async (username: string, password: string) => {
    try {
      const base64 = btoa(`${username}:${password}`);

      const res = await fetch(`api/auth/me`, {
        headers: { Authorization: "Basic " + base64 },
      });

      if (!res.ok) {
        setLoginError("Ongeldige inloggegevens");
        return false;
      }

      const serverUser = await res.json();

      const loggedInUser: UserProfile = {
        username,
        password,
        role: serverUser.role,
      };

      setUser(loggedInUser);
      localStorage.setItem("pos_user", JSON.stringify(loggedInUser));
      setLoginError("");

      return true;
    } catch {
      setLoginError("Server niet bereikbaar");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pos_user");
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!user?.password) throw new Error("Missing credentials");

    const base64 = btoa(`${user.username}:${user.password}`);

    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + base64,
        ...(options.headers || {}),
      },
    });
  };

  return { user, login, logout, loginError, authFetch };
};
