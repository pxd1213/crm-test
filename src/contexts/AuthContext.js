import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    email: 'mock@user.com',
    uid: 'mock-user-id'
  });
  const [loading, setLoading] = useState(false);

  function signup(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser({ email, uid: 'mock-user-id' });
        resolve({ user: { email, uid: 'mock-user-id' } });
      }, 1000);
    });
  }

  function login(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser({ email, uid: 'mock-user-id' });
        resolve({ user: { email, uid: 'mock-user-id' } });
      }, 1000);
    });
  }

  function logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        resolve();
      }, 1000);
    });
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
