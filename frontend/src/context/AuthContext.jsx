import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext.js';
import { authService } from '../services/auth.service.js';
import { toast } from 'sonner';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data?.user) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setUser(response.data.user);
        toast.success('Welcome back!');
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      if (response.success && response.data?.user) {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setUser(response.data.user);
        toast.success('Account created successfully!');
        return { success: true };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        toast.success('Profile updated');
        return { success: true };
      }
      return { success: false, message: response.message || 'Update failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Update failed' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      if (response.success) {
        toast.success('Password changed');
        return { success: true };
      }
      return { success: false, message: response.message || 'Password change failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Password change failed' };
    }
  };

  const value = {
    user,
    loading,
    initialized,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}