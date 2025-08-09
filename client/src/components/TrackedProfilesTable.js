import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeProfile } from '../services/trackerService';

const TrackedProfilesTable = ({ profiles, loading, error, onRefresh }) => {
  const handleDelete = async (id) => {
    try {
      await removeProfile(id);
      onRefresh(); // Trigger refresh after successful deletion
    } catch (err) {
      console.error('Failed to delete profile:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
        Tracked Profiles
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {profiles.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No profiles being tracked yet.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Following Count</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile._id}>
                  <TableCell>{profile.username}</TableCell>
                  <TableCell>{profile.notificationEmail}</TableCell>
                  <TableCell>{profile.followingCount}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleDelete(profile._id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default TrackedProfilesTable; 