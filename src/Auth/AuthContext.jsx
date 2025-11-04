// src/authcontext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { account } from "../appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jab app start ho to backend se check kare
    const checkAuthStatus = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.log("No active session:", error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const register = async (email, password, name) => {
    try {
      await account.create("unique()", email, password, name);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Register error:", error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  
  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
