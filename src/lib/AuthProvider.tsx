"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  fetchCurrentUser,
  refreshToken as apiRefreshToken,
  ApiUser,
  ApiError,
} from "@/lib/api";

interface AuthContextType {
  user: ApiUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; phone?: string }) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Persist / restore session on mount
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await fetchCurrentUser();
        setUser(me);
      } catch (err) {
        // Token expired — try refresh
        const refresh = localStorage.getItem("refresh_token");
        if (refresh) {
          try {
            const tokens = await apiRefreshToken(refresh);
            localStorage.setItem("access_token", tokens.access_token);
            localStorage.setItem("refresh_token", tokens.refresh_token);
            const me = await fetchCurrentUser();
            setUser(me);
          } catch {
            // Refresh also failed — clear session
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        } else {
          localStorage.removeItem("access_token");
        }
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const tokens = await apiLogin(email, password);
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      const me = await fetchCurrentUser();
      setUser(me);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Login failed. Please try again.";
      setError(message);
      throw err;
    }
  }, []);

  const register = useCallback(
    async (data: { email: string; password: string; full_name: string; phone?: string }) => {
      setError(null);
      try {
        const tokens = await apiRegister(data);
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
        const me = await fetchCurrentUser();
        setUser(me);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Registration failed. Please try again.";
        setError(message);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
