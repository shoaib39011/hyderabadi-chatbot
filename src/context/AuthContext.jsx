
import React, { createContext, useContext, useState } from 'react';

// Mock company emails for forwarding
export const companyEmails = {
  'ABC Organization': 'admin@abcorg.com',
  'XYZ Company': 'admin@xyzcompany.com',
  'XXX Inc': 'admin@xxxinc.com',
  'DEF Corporation': 'admin@defcorp.com',
  'GHI Enterprises': 'admin@ghient.com'
};

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([
    // Pre-populated super admin user
    { 
      id: 'superadmin', 
      username: 'admin', 
      email: 'admin@feedbackhub.com',
      role: 'admin',
      // No company for super admin - can see all feedbacks
    },
    // Pre-populated company users
    { 
      id: 'user1', 
      username: 'user_abc', 
      email: 'user@abcorg.com',
      role: 'user', 
      company: 'ABC Organization' 
    },
    { 
      id: 'user2', 
      username: 'user_xyz', 
      email: 'user@xyzcompany.com',
      role: 'user', 
      company: 'XYZ Company' 
    },
    { 
      id: 'user3', 
      username: 'user_xxx', 
      email: 'user@xxxinc.com',
      role: 'user', 
      company: 'XXX Inc' 
    },
  ]);

  const signup = (username, email, password, company) => {
    // In a real app, this would validate against a backend
    // For demo purposes, we'll simulate a successful signup
    const userId = Math.random().toString(36).substring(2, 10);
    const newUser = { 
      id: userId, 
      username, 
      email,
      role: 'user', 
      company 
    };
    
    setUsers([...users, newUser]);
    setUser(newUser); // Auto login after signup
  };

  const login = (username, password, role, company) => {
    // In a real app, this would validate against a backend
    // For demo purposes, check if user exists in our local "database"
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser) {
      setUser(foundUser);
    } else {
      // If user not found, create a temporary one (for demo purposes)
      const userId = Math.random().toString(36).substring(2, 10);
      const tempUser = { 
        id: userId, 
        username, 
        email: '', 
        role: role, 
        company 
      };
      setUser(tempUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  // Helper function to get company email
  const getCompanyEmail = (company) => {
    return companyEmails[company] || 'contact@company.com';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      signup, 
      logout, 
      isAuthenticated, 
      isAdmin, 
      getCompanyEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
