import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'student'
  const [currentUser, setCurrentUser] = useState(null);

  // Simple admin credentials (in real app, this would be from backend)
  const adminCredentials = {
    username: 'admin',
    password: 'admin123'
  };

  const loginAdmin = (username, password) => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAuthenticated(true);
      setUserRole('admin');
      setCurrentUser({ username, role: 'admin' });
      localStorage.setItem('authToken', 'admin-token');
      localStorage.setItem('userRole', 'admin');
      return { success: true };
    } else {
      return { success: false, message: 'Invalid admin credentials' };
    }
  };

  const loginStudent = (studentData) => {
    setIsAuthenticated(true);
    setUserRole('student');
    setCurrentUser(studentData);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  // Check if user is already logged in (for page refresh)
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    if (token && role === 'admin') {
      setIsAuthenticated(true);
      setUserRole('admin');
      setCurrentUser({ username: 'admin', role: 'admin' });
    }
  }, []);

  const value = {
    isAuthenticated,
    userRole,
    currentUser,
    loginAdmin,
    loginStudent,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
