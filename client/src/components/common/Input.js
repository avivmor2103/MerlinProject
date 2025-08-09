import React from 'react';
import { TextField } from '@mui/material';

const Input = ({ label, type, value, onChange, error, helperText, ...props }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      margin="normal"
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      {...props}
    />
  );
};

export default Input; 