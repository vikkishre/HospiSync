import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return storedUser && token
      ? { ...JSON.parse(storedUser), token }
      : {};
  });

  const login = async (username, password) => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();

    const userWithToken = { ...data.user, token: data.token };
    setAuth(userWithToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    return data.user.role;
  };

  const logout = () => {
    setAuth({});
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
