import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, Typography, Box } from '@mui/material';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { register } from '../services/authService';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(formData.email, formData.password);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            width: '100%',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography 
            component="h1" 
            variant="h5" 
            align="center" 
            gutterBottom
            sx={{ 
              color: 'primary.main',
              fontWeight: 'bold',
              mb: 3
            }}
          >
            Sign Up for Merlin
          </Typography>
          
          {error && (
            <Typography 
              color="error" 
              align="center" 
              gutterBottom
              sx={{ mb: 2 }}
            >
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 2 }}
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              sx={{ 
                mt: 2,
                mb: 2,
                py: 1.5
              }}
            >
              Sign Up
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography 
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    textDecoration: 'none',
                    color: 'inherit',
                    fontWeight: 'bold',
                    color: '#90caf9'
                  }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp; 