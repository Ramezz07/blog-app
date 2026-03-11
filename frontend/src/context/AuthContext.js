import { createContext, useContext, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('blogUser');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await apiLogin({ email, password });
    localStorage.setItem('blogUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await apiRegister({ name, email, password });
    localStorage.setItem('blogUser', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('blogUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
