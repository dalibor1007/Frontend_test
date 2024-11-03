import React, { createContext, useState, useEffect } from "react";
import {
  login as loginService,
  register as registerService,
  getCurrentUser,
  logout as logoutService,
} from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getCurrentUser();
    if (token) {
      const userData = parseJwt(token); // Parse JWT to get user details if available
      if (userData) {
        setUser({ ...userData, token, uuid: userData.uuid }); // Add uuid to user state
      } else {
        console.error("Failed to parse user data from token");
      }
    }
  }, []);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return null;
    }
  };

  const login = async (email, password) => {
    const response = await loginService(email, password);
    if (response.success) {
      const { token } = response.data;
      const userData = parseJwt(token); // Parse JWT for user data
      if (userData) {
        setUser({ ...userData, token, uuid: userData.uuid }); // Store uuid directly in user
        localStorage.setItem("token", token); // Store token in localStorage
      }
    }
    return response;
  };

  const register = async (username, email, password) => {
    const response = await registerService(username, email, password);
    if (response.success) {
      console.log("User registered successfully");
    }
    return response;
  };

  const logout = () => {
    setUser(null);
    logoutService();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
