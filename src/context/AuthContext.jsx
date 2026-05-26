import React, { createContext, useContext, useState, useEffect } from "react";
import { getStoredUsers } from "../utils/rbacData";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const uName = username.trim().toLowerCase();
    const uPass = password.trim();

    // Direct support for admin/admin
    if (uName === "admin" && uPass === "admin") {
      const adminUser = {
        id: 1,
        email: "admin@cargill.com",
        role: "Org Admin"
      };
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem("auth_user", JSON.stringify(adminUser));
      return true;
    }

    // Flexible testing login: prefix of email is user and pass (e.g. hr_admin / hr_admin)
    const users = getStoredUsers();
    const matchedUser = users.find(u => {
      const prefix = u.email.split("@")[0].toLowerCase();
      return prefix === uName && uName === uPass.toLowerCase();
    });

    if (matchedUser) {
      const sessionUser = {
        id: matchedUser.id,
        email: matchedUser.email,
        role: matchedUser.role
      };
      setUser(sessionUser);
      setIsAuthenticated(true);
      localStorage.setItem("auth_user", JSON.stringify(sessionUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
