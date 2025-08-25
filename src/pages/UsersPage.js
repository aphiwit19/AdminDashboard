// Users Page with integrated SOS History
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import userService from '../services/user.service.js';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userContacts, setUserContacts] = useState([]);
  const [userSOSHistory, setUserSOSHistory] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingSOSHistory, setLoadingSOSHistory] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setUserContacts([]);
    setUserSOSHistory([]);
    setOpenDialog(true);
    
    // โหลดรายชื่อติดต่อ
    try {
      setLoadingContacts(true);
      const contacts = await userService.getUserContacts(user.userId);
      setUserContacts(contacts);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoadingContacts(false);
    }

    // โหลด SOS History
    try {
      setLoadingSOSHistory(true);
      const sosHistory = await userService.getUserSOSHistory(user.userId, 10);
      setUserSOSHistory(sosHistory);
    } catch (error) {
      console.error('Error loading SOS history:', error);
    } finally {
      setLoadingSOSHistory(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setUserContacts([]);
    setUserSOSHistory([]);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin':
        return '#F44336';
      case 'admin':
        return '#FF9800';
      default:
        return '#4CAF50';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'resolved':
        return 'success';
      case 'in_progress':
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'เสร็จสิ้น';
      case 'resolved':
        return 'แก้ไขแล้ว';
      case 'in_progress':
        return 'กำลังดำเนินการ';
      case 'pending':
        return 'รอดำเนินการ';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return status || 'ไม่ระบุ';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'ไม่ระบุ';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'ไม่ระบุ';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={50} sx={{ color: '#7F8C8D' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#2E4057', fontWeight: 'bold' }}>
        Users
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#E8F4FD' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>ชื่อ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>โทรศัพท์</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>เพศ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>กรุ๊ปเลือด</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>โรคประจำตัว</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>ภูมิแพ้</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId} hover>
                <TableCell>{user.name || 'ไม่ระบุ'}</TableCell>
                <TableCell>{user.phone || 'ไม่ระบุ'}</TableCell>
                <TableCell>{user.gender || 'ไม่ระบุ'}</TableCell>
                <TableCell>{user.bloodType || 'ไม่ระบุ'}</TableCell>
                <TableCell>{user.disease || 'ไม่ระบุ'}</TableCell>
                <TableCell>{user.allergy || 'ไม่ระบุ'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton
                    sx={{
                      color: '#E64646',
                      '&:hover': {
                        backgroundColor: '#FFE8E8',
                        color: '#C23E3E'
                      }
                    }}
                    onClick={() => handleViewUser(user)}
                    title="ดูรายชื่อติดต่อฉุกเฉินและประวัติ SOS"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            ยังไม่มีข้อมูลผู้ใช้
          </Typography>
        </Box>
      )}

      {/* User Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon />
            รายชื่อติดต่อฉุกเฉินและประวัติ SOS: {selectedUser?.name || 'ไม่ระบุ'}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              {/* รายชื่อติดต่อ */}
              <Typography variant="h6" sx={{ mb: 2, color: '#E64646', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon />
                รายชื่อติดต่อฉุกเฉิน
              </Typography>
              
              {loadingContacts ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : userContacts.length > 0 ? (
                <List>
                  {userContacts.map((contact, index) => (
                    <ListItem key={contact.contactId} divider={index < userContacts.length - 1}>
                      <ListItemText
                        primary={contact.name || 'ไม่ระบุชื่อ'}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              โทร: {contact.phone || 'ไม่ระบุ'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              เพิ่มเมื่อ: {formatDate(contact.addedAt)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
                  ยังไม่มีรายชื่อติดต่อฉุกเฉิน
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              {/* SOS History */}
              <Typography variant="h6" sx={{ mb: 2, color: '#E64646', display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon />
                ประวัติการใช้ SOS
              </Typography>
              
              {loadingSOSHistory ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : userSOSHistory.length > 0 ? (
                <List>
                  {userSOSHistory.map((history, index) => (
                    <ListItem key={`${history.historyId}-${index}`} divider={index < userSOSHistory.length - 1}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="body1">
                              {formatDate(history.timestamp)}
                            </Typography>
                            <Chip 
                              label={getStatusLabel(history.status)} 
                              size="small" 
                              color={getStatusColor(history.status)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              ข้อความ: {history.message || 'ไม่มีข้อความ'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              เบอร์ติดต่อ: {history.phoneNumbers || 'ไม่ระบุ'}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
                  ยังไม่มีประวัติการใช้ SOS
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;