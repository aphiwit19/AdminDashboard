// Protected Route Component
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext.js';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  // แสดง loading ขณะตรวจสอบสถานะ
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}
      >
        <CircularProgress size={50} sx={{ color: '#E64646' }} />
      </Box>
    );
  }

  // ถ้ายังไม่ได้เข้าสู่ระบบ ไปหน้า login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ถ้าเข้าสู่ระบบแล้วแต่ไม่ใช่ admin ให้แสดงข้อความ
  if (!isAdmin) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h4" color="error">
          ไม่มีสิทธิ์เข้าใช้งาน
        </Typography>
        <Typography variant="body1" color="text.secondary">
          คุณไม่มีสิทธิ์เข้าใช้งานระบบ Admin Dashboard
        </Typography>
      </Box>
    );
  }

  // ถ้าผ่านการตรวจสอบทั้งหมดแล้ว ให้แสดงเนื้อหา
  return children;
};

export default ProtectedRoute;