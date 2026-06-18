import { createContext, useContext, useState, useEffect } from "react";
import { users } from "../data/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (name, password) => {
    const foundUser = users.find(
      (u) => u.name === name && u.password === password
    );

    if (!foundUser) {
      return false; // login failed
    }

    setUser({ name: foundUser.name, role: foundUser.role });
    return true; // login success
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}