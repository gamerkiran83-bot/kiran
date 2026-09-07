import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { http } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("exploro_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("exploro_token") || null;
  });

  const [wishlistIds, setWishlistIds] = useState(new Set());

  const refreshWishlist = useCallback(async () => {
    if (!localStorage.getItem("exploro_token")) {
      setWishlistIds(new Set());
      return;
    }
    try {
      const res = await http.get("/wishlist");
      const ids = new Set((res.data || []).map((w) => w.destination_id));
      setWishlistIds(ids);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshWishlist();
    } else {
      setWishlistIds(new Set());
    }
  }, [token, refreshWishlist]);

  const login = async (email, password) => {
    const res = await http.post("/auth/login", { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem("exploro_token", newToken);
    localStorage.setItem("exploro_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    refreshWishlist();
    return newUser;
  };

  const register = async (name, email, password, phone = "") => {
    const res = await http.post("/auth/register", { name, email, password, phone });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem("exploro_token", newToken);
    localStorage.setItem("exploro_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    refreshWishlist();
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("exploro_token");
    localStorage.removeItem("exploro_user");
    setToken(null);
    setUser(null);
    setWishlistIds(new Set());
  };

  const updateUser = (data) => {
    setUser((prev) => {
      const next = { ...prev, ...data };
      localStorage.setItem("exploro_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        wishlistIds,
        login,
        register,
        logout,
        refreshWishlist,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      wishlistIds: new Set(),
      login: async () => {},
      register: async () => {},
      logout: () => {},
      refreshWishlist: async () => {},
      updateUser: () => {},
    };
  }
  return context;
};
