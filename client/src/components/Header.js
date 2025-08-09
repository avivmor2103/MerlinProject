import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="transparent" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            color: 'primary.main',
            fontWeight: 'bold'
          }}
        >
          Merlin - InstaTracker
        </Typography>
        <Box>
          <Button 
            color="primary" 
            variant="outlined"
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 