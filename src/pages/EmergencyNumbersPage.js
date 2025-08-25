// Emergency Numbers Page
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
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
  TextField,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import emergencyNumberService from '../services/emergency_number.service.js';

const EmergencyNumbersPage = () => {
  const [emergencyNumbers, setEmergencyNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    category: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEmergencyNumbers();
  }, []);

  const loadEmergencyNumbers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await emergencyNumberService.getAll();
      setEmergencyNumbers(data);
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลเบอร์ฉุกเฉินได้');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        number: item.number,
        category: item.category
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        number: '',
        category: ''
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      name: '',
      number: '',
      category: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'ชื่อหน่วยงานห้ามว่าง';
    if (!formData.number.trim()) errors.number = 'หมายเลขโทรศัพท์ห้ามว่าง';
    if (!formData.category.trim()) errors.category = 'หมวดหมู่ห้ามว่าง';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      if (editingItem) {
        await emergencyNumberService.update(editingItem.id, formData);
      } else {
        await emergencyNumberService.create(formData);
      }
      await loadEmergencyNumbers();
      handleCloseDialog();
    } catch (error) {
      setError(editingItem ? 'ไม่สามารถอัปเดตข้อมูลได้' : 'ไม่สามารถเพิ่มข้อมูลได้');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`ต้องการลบ "${item.name}" หรือไม่?`)) {
      try {
        await emergencyNumberService.delete(item.id);
        await loadEmergencyNumbers();
      } catch (error) {
        setError('ไม่สามารถลบข้อมูลได้');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={50} sx={{ color: '#FF5722' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#FF5722', fontWeight: 'bold' }}>
          Emergency Numbers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#FF5722',
            '&:hover': { bgcolor: '#E64A19' }
          }}
        >
          เพิ่มเบอร์ฉุกเฉิน
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#FFF3E0' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>ชื่อหน่วยงาน</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>หมายเลขโทรศัพท์</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>หมวดหมู่</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emergencyNumbers.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.number}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.category} 
                    size="small" 
                    sx={{ 
                      bgcolor: '#FF5722', 
                      color: 'white' 
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(item)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {emergencyNumbers.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            ยังไม่มีข้อมูลเบอร์ฉุกเฉิน
          </Typography>
        </Box>
      )}

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'แก้ไขเบอร์ฉุกเฉิน' : 'เพิ่มเบอร์ฉุกเฉิน'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ชื่อหน่วยงาน"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!formErrors.name}
            helperText={formErrors.name}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="หมายเลขโทรศัพท์"
            fullWidth
            variant="outlined"
            value={formData.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
            error={!!formErrors.number}
            helperText={formErrors.number}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="หมวดหมู่"
            fullWidth
            variant="outlined"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            error={!!formErrors.category}
            helperText={formErrors.category}
            placeholder="เช่น ตำรวจ, โรงพยาบาล, ดับเพลิง"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            sx={{
              bgcolor: '#FF5722',
              '&:hover': { bgcolor: '#E64A19' }
            }}
          >
            {saving ? <CircularProgress size={20} /> : (editingItem ? 'อัปเดต' : 'เพิ่ม')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyNumbersPage;