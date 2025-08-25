// Authentication Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 เริ่มติดตามสถานะการเข้าสู่ระบบ...');
    
    const unsubscribe = authService.onAuthStateChanged((user) => {
      console.log('👤 สถานะการเข้าสู่ระบบเปลี่ยนแปลง:', user?.email || 'ไม่มีผู้ใช้');
      setUser(user);
      setLoading(false);
    });

    return () => {
      console.log('🔄 หยุดติดตามสถานะการเข้าสู่ระบบ');
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 เริ่มการเข้าสู่ระบบจาก Context...');
      const result = await authService.login(email, password);
      // Set user พร้อม role
      setUser({ ...result.user, role: result.role });
      console.log('✅ เข้าสู่ระบบสำเร็จใน Context', { role: result.role });
      return result;
    } catch (error) {
      console.error('❌ การเข้าสู่ระบบล้มเหลวใน Context:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 เริ่มการออกจากระบบจาก Context...');
      await authService.logout();
      setUser(null);
      console.log('✅ ออกจากระบบสำเร็จใน Context');
    } catch (error) {
      console.error('❌ การออกจากระบบล้มเหลวใน Context:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Debug log สำหรับตรวจสอบ role
  console.log('🔍 Auth Debug:', {
    userExists: !!user,
    userRole: user?.role,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin'
  });

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};