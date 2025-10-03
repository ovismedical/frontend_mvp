import { createContext, useContext, useState, useEffect } from "react";
import { getUserInfo, validateToken } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setAuthLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      const isValid = await validateToken();
      if (isValid) {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    };
    initAuth();
  }, []);

  // Add login function
  const login = (userData) => {
    setUser(userData);
  };

  // Add logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthLoading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
