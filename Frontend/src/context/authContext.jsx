import React, { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userId: localStorage.getItem("userId") || null,
    role: localStorage.getItem("role") || null,
    token: localStorage.getItem("token") || null,
    name: localStorage.getItem("name") || null
  });

  useEffect(() => {
    if (user.token) {
      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.userId || "");
      localStorage.setItem("role", user.role || "");
      localStorage.setItem("name", user.name || "");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      setUser({
        token: res.data.token,
        userId: res.data.userId,
        role: res.data.role,
        name: credentials.name || ""
      });
      toast.success("Logged in successfully");
      if (res.data.role === "OFFICER") navigate("/officer");
      else navigate("/customer");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = () => {
    setUser({ userId: null, role: null, token: null, name: null });
    navigate("/login");
  };

  const register = async (payload) => {
    try {
      await api.post("/auth/register", payload);
      toast.success("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
