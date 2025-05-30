import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {

  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Avatar,
  Typography,
  Box
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddTaskIcon from '@mui/icons-material/PlaylistAdd';
import TaskIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

const drawerWidth = 240;

const Sidebar = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        setUser(res.data);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };

    fetchProfile();
  }, []);




  const handleNavigate = (path) => {
    if (path === 'logout') {
      logout();  // Clear token from context & localStorage
      navigate('/auth/signin');  // Redirect to signin
    } else {
      navigate(path);
    }
    if (onNavigate) {
      onNavigate(); // close drawer on mobile
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >

      <Toolbar />

      {user && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={2}
          mt={-3}
        >
          <Avatar sx={{ bgcolor: '#13AA52', width: 56, height: 56, fontSize: 24 }}>
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={600} mt={1}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      )}



      <Divider />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/user/dashboard' },
          { text: 'Create Task', icon: <AddTaskIcon />, path: '/user/create-task' },
          { text: 'Manage Task', icon: <TaskIcon />, path: '/user/manage-task' },
          { text: 'Logout', icon: <LogoutIcon />, path: 'logout' },
        ].map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleNavigate(path)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
