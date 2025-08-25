// Sidebar Component
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Phone as PhoneIcon,
  MenuBook as MenuBookIcon,
  LocalHospital as LocalHospitalIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    text: 'Emergency Numbers',
    icon: <PhoneIcon />,
    path: '/emergency-numbers'
  },
  {
    text: 'Emergency Guides',
    icon: <MenuBookIcon />,
    path: '/emergency-guides'
  },
  {
    text: 'First Aid',
    icon: <LocalHospitalIcon />,
    path: '/first-aid'
  },
  {
    text: 'Users',
    icon: <PeopleIcon />,
    path: '/users'
  }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box>
      {/* Logo/Title */}
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#E64646', fontWeight: 'bold' }}>
          SOS Admin
        </Typography>
      </Toolbar>
      
      <Divider />

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#E64646',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#C23E3E'
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  }
                },
                '&:hover': {
                  backgroundColor: '#FFE8E8'
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : '#E64646' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;