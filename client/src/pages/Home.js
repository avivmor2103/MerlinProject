import React, { useState, useEffect } from 'react';
import { Container, Box, Grid } from '@mui/material';
import Header from '../components/Header';
import TrackerForm from '../components/TrackerForm';
import TrackedProfilesTable from '../components/TrackedProfilesTable';
import { getProfiles } from '../services/trackerService';

const Home = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await getProfiles();
        setProfiles(response.data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to fetch profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [refreshTrigger]);

  const handleProfileAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid 
          container 
          spacing={4}
          direction="column"
          alignItems="center"
        >
          {/* Tracker Form */}
          <Grid item xs={12} sx={{ width: '100%', maxWidth: 600 }}>
            <TrackerForm onProfileAdded={handleProfileAdded} />
          </Grid>

          {/* Tracked Profiles Table */}
          <Grid item xs={12} sx={{ width: '100%', maxWidth: 800 }}>
            <TrackedProfilesTable 
              profiles={profiles}
              loading={loading}
              error={error}
              onRefresh={handleProfileAdded}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 