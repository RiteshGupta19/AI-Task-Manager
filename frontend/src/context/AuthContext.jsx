
import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance'; // adjust path

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ accessToken: null });
  const [loading, setLoading] = useState(true); // prevent early render before auth is checked

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      setAuth({ accessToken: token });
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('accessToken', token);
    setAuth({ accessToken: token });
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAuth({ accessToken: null });
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!auth.accessToken;

  if (loading) return <div></div>; 

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
