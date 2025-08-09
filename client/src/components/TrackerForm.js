import React, { useState } from 'react';
import { Paper, Typography, Box, Alert } from '@mui/material';
import Input from './common/Input';
import Button from './common/Button';
import { addProfile } from '../services/trackerService';

const TrackerForm = ({ onProfileAdded }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to track profiles');
      return;
    }

    // Basic validation
    if (!formData.username.trim() || !formData.email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Username validation (basic Instagram handle format)
    const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
    if (!usernameRegex.test(formData.username)) {
      setError('Please enter a valid Instagram username');
      return;
    }

    setLoading(true);
    try {
      await addProfile(formData.username, formData.email);
      setSuccess('Profile added successfully!');
      setFormData({ username: '', email: '' }); // Clear form
      if (onProfileAdded) {
        onProfileAdded(); // Notify parent component
      }
    } catch (err) {
      setError(err.message || 'Failed to add profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 4,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: 'primary.main',
          fontWeight: 'bold',
          mb: 3
        }}
      >
        Add Instagram Profile to Track
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Instagram Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="@username (without @)"
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <Input
          label="Notification Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ mb: 3 }}
          disabled={loading}
        />
        <Button
          type="submit"
          sx={{ 
            mt: 2,
            py: 1.5
          }}
          disabled={loading}
        >
          {loading ? 'Adding Profile...' : 'Add Profile'}
        </Button>
      </form>
    </Paper>
  );
};

export default TrackerForm; 