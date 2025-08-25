// Login Page
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.js';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container component="main" maxWidth="sm">
        <Card 
          sx={{ 
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box
            sx={{
              background: '#E64646',
              color: 'white',
              textAlign: 'center',
              py: 4,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3
              }
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 1,
                position: 'relative',
                zIndex: 1
              }}
            >
               SOS
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 300,
                position: 'relative',
                zIndex: 1
              }}
            >
              Admin Dashboard
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: '#E64646'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E64646'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E64646'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#E64646'
                  }
                }}
              />
                  <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E64646'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#E64646'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#E64646'
                  }
                }}
                  />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 2, 
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  background: '#E64646',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(230, 70, 70, 0.3)',
                  '&:hover': {
                    background: '#C23E3E',
                    boxShadow: '0 12px 25px rgba(230, 70, 70, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: '#ccc'
                  },
                  transition: 'all 0.3s ease'
                }}
                disabled={loading}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={24} color="inherit" />
                    กำลังเข้าสู่ระบบ...
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     เข้าสู่ระบบ
                  </Box>
                )}
              </Button>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  fontSize: '0.875rem',
                  opacity: 0.7
                }}
              >
                ระบบจัดการแอดมิน SOS Emergency
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  fontSize: '0.75rem',
                  mt: 0.5,
                  opacity: 0.5
                }}
              >
                © 2025 SOS Emergency System
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;