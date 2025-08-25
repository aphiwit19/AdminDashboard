import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import AdminLayout from './components/Layout/AdminLayout.js';
import LoginPage from './pages/LoginPage.js';
import DashboardPage from './pages/DashboardPage.js';
import EmergencyNumbersPage from './pages/EmergencyNumbersPage.js';
import EmergencyGuidesPage from './pages/EmergencyGuidesPage.js';
import FirstAidPage from './pages/FirstAidPage.js';
import UsersPage from './pages/UsersPage.js';
import './App.css';

// สร้าง theme สำหรับ Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722',
    },
    secondary: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AdminLayout>
                  <DashboardPage />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/emergency-numbers" element={
              <ProtectedRoute>
                <AdminLayout>
                  <EmergencyNumbersPage />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/emergency-guides" element={
              <ProtectedRoute>
                <AdminLayout>
                  <EmergencyGuidesPage />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/first-aid" element={
              <ProtectedRoute>
                <AdminLayout>
                  <FirstAidPage />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute>
                <AdminLayout>
                  <UsersPage />
                </AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
