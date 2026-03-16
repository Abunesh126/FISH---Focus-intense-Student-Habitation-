import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

/**
 * Authentication Context for managing user state globally
 */
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  updatePreferences: async () => {},
  checkAuthStatus: async () => {},
});

/**
 * Hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth methods to children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check authentication status on app load
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check if user is currently authenticated
   */
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await API.auth.getStatus();
      
      if (response.authenticated && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log in user with email and password
   */
  const login = async (email, password) => {
    try {
      const response = await API.auth.login(email, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, message: response.message };
      } else {
        throw new Error('Login failed: Invalid response');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: API.utils.formatErrorMessage(error)
      };
    }
  };

  /**
   * Log out current user
   */
  const logout = async () => {
    try {
      await API.auth.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout request fails, clear local state
      setUser(null);
      return { 
        success: false, 
        message: API.utils.formatErrorMessage(error)
      };
    }
  };

  /**
   * Update user preferences
   */
  const updatePreferences = async (preferences) => {
    try {
      await API.user.updatePreferences(preferences);
      
      // Update local user state with new preferences
      setUser(prevUser => ({
        ...prevUser,
        preferences: {
          ...prevUser.preferences,
          ...preferences
        }
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Preferences update error:', error);
      return { 
        success: false, 
        message: API.utils.formatErrorMessage(error)
      };
    }
  };

  /**
   * Get full user profile (refresh from server)
   */
  const refreshUserProfile = async () => {
    try {
      const profile = await API.user.getProfile();
      setUser(profile);
      return { success: true };
    } catch (error) {
      console.error('Profile refresh error:', error);
      return { 
        success: false, 
        message: API.utils.formatErrorMessage(error)
      };
    }
  };

  const contextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updatePreferences,
    checkAuthStatus,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;