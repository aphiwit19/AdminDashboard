// Emergency Guides Page
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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import emergencyGuideService from '../services/emergency_guide.service.js';

const EmergencyGuidesPage = () => {
  const [emergencyGuides, setEmergencyGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEmergencyGuides();
  }, []);

  const loadEmergencyGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await emergencyGuideService.getAll();
      setEmergencyGuides(data);
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลคู่มือฉุกเฉินได้');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: ''
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
    setFormData({
      title: '',
      description: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'หัวข้อห้ามว่าง';
    if (!formData.description.trim()) errors.description = 'รายละเอียดห้ามว่าง';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      if (editingItem) {
        await emergencyGuideService.update(editingItem.id, formData);
      } else {
        await emergencyGuideService.create(formData);
      }
      await loadEmergencyGuides();
      handleCloseDialog();
    } catch (error) {
      setError(editingItem ? 'ไม่สามารถอัปเดตข้อมูลได้' : 'ไม่สามารถเพิ่มข้อมูลได้');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`ต้องการลบ "${item.title}" หรือไม่?`)) {
      try {
        await emergencyGuideService.delete(item.id);
        await loadEmergencyGuides();
      } catch (error) {
        setError('ไม่สามารถลบข้อมูลได้');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={50} sx={{ color: '#E64646' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#2E4057', fontWeight: 'bold' }}>
          Emergency Guides
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#27AE60',
            '&:hover': { bgcolor: '#219A52' }
          }}
        >
          เพิ่มคู่มือฉุกเฉิน
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
            <TableRow sx={{ bgcolor: '#E8F4FD' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>หัวข้อ</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>รายละเอียด</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emergencyGuides.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{item.title}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ 
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    maxWidth: '400px'
                  }}>
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton
                    sx={{ mr: 1, color: '#F39C12' }}
                    onClick={() => handleOpenDialog(item)}
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

      {emergencyGuides.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            ยังไม่มีข้อมูลคู่มือฉุกเฉิน
          </Typography>
        </Box>
      )}

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'แก้ไขคู่มือฉุกเฉิน' : 'เพิ่มคู่มือฉุกเฉิน'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="หัวข้อ"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            error={!!formErrors.title}
            helperText={formErrors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="รายละเอียด"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!formErrors.description}
            helperText={formErrors.description}
            placeholder="อธิบายขั้นตอนการปฏิบัติในสถานการณ์ฉุกเฉิน..."
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
              bgcolor: '#27AE60',
              '&:hover': { bgcolor: '#219A52' }
            }}
          >
            {saving ? <CircularProgress size={20} /> : (editingItem ? 'อัปเดต' : 'เพิ่ม')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmergencyGuidesPage;