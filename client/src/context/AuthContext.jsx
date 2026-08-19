import { createContext, useContext, useState } from "react";

import { api } from "../services/api";

const AuthContext = createContext(null);

// =====================================================
// GET SAVED USER
// =====================================================

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("staynest_user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Saved user parse error:", error);

    return null;
  }
};

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const [loading, setLoading] = useState(false);

  // =================================================
  // SAVE USER
  // =================================================

  const saveUser = (userData) => {
    if (!userData) {
      return;
    }

    localStorage.setItem("staynest_user", JSON.stringify(userData));

    setUser(userData);
  };

  // =================================================
  // REGISTER
  // =================================================

  const register = async (name, email, password) => {
    setLoading(true);

    try {
      if (!name || !email || !password) {
        return {
          success: false,
          message: "Name, email and password are required.",
        };
      }

      const result = await api.register({
        name,
        email,
        password,
      });

      console.log("REGISTER RESPONSE:", result);

      // JWT check
      if (!result?.token) {
        return {
          success: false,
          message: "Registration failed: JWT token not received.",
        };
      }

      // Save token
      localStorage.setItem("staynest_token", result.token);

      // Save user
      if (result.user) {
        saveUser(result.user);
      }

      return {
        success: true,
        message: result.message || "Registration successful.",
        user: result.user,
        token: result.token,
      };
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      return {
        success: false,
        message: error.message || "Registration failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  // =================================================
  // LOGIN
  // =================================================

  const login = async (email, password) => {
    setLoading(true);

    try {
      if (!email || !password) {
        return {
          success: false,
          message: "Email and password are required.",
        };
      }

      const result = await api.login({
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", result);

      // JWT check
      if (!result?.token) {
        return {
          success: false,
          message: "Login failed: JWT token not received.",
        };
      }

      // Save token
      localStorage.setItem("staynest_token", result.token);

      // Save user
      if (result.user) {
        saveUser(result.user);
      }

      return {
        success: true,
        message: result.message || "Login successful.",
        user: result.user,
        token: result.token,
      };
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      // Clear invalid session
      localStorage.removeItem("staynest_token");

      localStorage.removeItem("staynest_user");

      setUser(null);

      return {
        success: false,
        message: error.message || "Invalid email or password.",
      };
    } finally {
      setLoading(false);
    }
  };

  // =================================================
  // LOGOUT
  // =================================================

  const logout = () => {
    localStorage.removeItem("staynest_token");

    localStorage.removeItem("staynest_user");

    setUser(null);
  };

  // =================================================
  // CHECK AUTH
  // =================================================

  const isAuthenticated =
    Boolean(user) && Boolean(localStorage.getItem("staynest_token"));

  // =================================================
  // CONTEXT
  // =================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        saveUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}