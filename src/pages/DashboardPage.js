// Dashboard Page
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Phone as PhoneIcon,
  MenuBook as MenuBookIcon,
  LocalHospital as LocalHospitalIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import emergencyNumberService from '../services/emergency_number.service.js';
import emergencyGuideService from '../services/emergency_guide.service.js';
import firstAidService from '../services/first_aid.service.js';
import userService from '../services/user.service.js';

const StatCard = ({ title, value, icon, color = '#FF5722' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: 1, 
            bgcolor: `${color}20`,
            color: color,
            mr: 2 
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>
      <Typography variant="h3" sx={{ color: color, fontWeight: 'bold' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    emergencyNumbers: 0,
    emergencyGuides: 0,
    firstAids: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 เริ่มโหลดสถิติ Dashboard...');

      const [emergencyNumbers, emergencyGuides, firstAids, userStats] = await Promise.all([
        emergencyNumberService.getAll(),
        emergencyGuideService.getAll(),
        firstAidService.getAll(),
        userService.getUserStats()
      ]);

      setStats({
        emergencyNumbers: emergencyNumbers.length,
        emergencyGuides: emergencyGuides.length,
        firstAids: firstAids.length,
        users: userStats.totalUsers
      });

      console.log('✅ โหลดสถิติ Dashboard สำเร็จ');
    } catch (error) {
      console.error('❌ โหลดสถิติ Dashboard ล้มเหลว:', error);
      setError('ไม่สามารถโหลดข้อมูลสถิติได้');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={50} sx={{ color: '#FF5722' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: '#FF5722', fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Emergency Numbers"
            value={stats.emergencyNumbers}
            icon={<PhoneIcon />}
            color="#FF5722"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Emergency Guides"
            value={stats.emergencyGuides}
            icon={<MenuBookIcon />}
            color="#2196F3"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="First Aid Content"
            value={stats.firstAids}
            icon={<LocalHospitalIcon />}
            color="#4CAF50"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.users}
            icon={<PeopleIcon />}
            color="#9C27B0"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#FF5722' }}>
              ยินดีต้อนรับสู่ SOS Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ระบบจัดการข้อมูลสำหรับแอปพลิเคชัน SOS ฉุกเฉิน 
              สามารถจัดการข้อมูลเบอร์ฉุกเฉิน คู่มือฉุกเฉิน การปฐมพยาบาล และดูข้อมูลผู้ใช้ได้
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;