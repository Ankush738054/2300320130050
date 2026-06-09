import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const PriorityNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [selectedType, setSelectedType] = useState('all');
  const [viewedNotifications, setViewedNotifications] = useState(new Set());

  useEffect(() => {
    fetchPriorityNotifications();
  }, [limit]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, selectedType, viewedNotifications]);

  const fetchPriorityNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/priority-notifications?n=${limit}`);
      const priorityNotifications = response.data.data || [];
      setNotifications(priorityNotifications);
    } catch (err) {
      setError(err.message || 'Failed to fetch priority notifications');
      console.error('Error fetching priority notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.Type === selectedType);
    }

    setFilteredNotifications(filtered);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  const handleNotificationView = (id) => {
    setViewedNotifications(prev => new Set([...prev, id]));
  };

  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value) || 10;
    setLimit(Math.max(1, Math.min(100, value)));
  };

  const getChipColor = (type) => {
    const colors = {
      'Placement': 'success',
      'Result': 'info',
      'Event': 'warning',
    };
    return colors[type] || 'default';
  };

  const getPriorityLabel = (type) => {
    const priorities = {
      'Placement': '⭐⭐⭐ High',
      'Result': '⭐⭐ Medium',
      'Event': '⭐ Low',
    };
    return priorities[type] || 'Normal';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Priority Notifications
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Controls Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="end">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Show Top N Notifications"
              type="number"
              value={limit}
              onChange={handleLimitChange}
              inputProps={{ min: 1, max: 100 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Filter by Type
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              <Button
                variant={selectedType === 'all' ? 'contained' : 'outlined'}
                onClick={() => handleTypeFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={selectedType === 'Placement' ? 'contained' : 'outlined'}
                onClick={() => handleTypeFilter('Placement')}
              >
                Placement ({notifications.filter(n => n.Type === 'Placement').length})
              </Button>
              <Button
                variant={selectedType === 'Result' ? 'contained' : 'outlined'}
                onClick={() => handleTypeFilter('Result')}
              >
                Result ({notifications.filter(n => n.Type === 'Result').length})
              </Button>
              <Button
                variant={selectedType === 'Event' ? 'contained' : 'outlined'}
                onClick={() => handleTypeFilter('Event')}
              >
                Event ({notifications.filter(n => n.Type === 'Event').length})
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Notifications Grid */}
      <Grid container spacing={2}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <Grid item xs={12} sm={6} md={4} key={notification.ID}>
              <Card
                onClick={() => handleNotificationView(notification.ID)}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  backgroundColor: viewedNotifications.has(notification.ID)
                    ? '#f5f5f5'
                    : '#fff',
                  borderTop: `6px solid ${
                    notification.Type === 'Placement'
                      ? '#4caf50'
                      : notification.Type === 'Result'
                      ? '#2196f3'
                      : '#ff9800'
                  }`,
                  transition: 'box-shadow 0.3s, transform 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Chip
                        label={notification.Type}
                        color={getChipColor(notification.Type)}
                        size="small"
                      />
                      <Chip
                        label={getPriorityLabel(notification.Type)}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    {!viewedNotifications.has(notification.ID) && (
                      <Chip label="NEW" color="primary" size="small" />
                    )}
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {notification.Message}
                  </Typography>

                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                    Rank: #{index + 1}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {new Date(notification.Timestamp).toLocaleDateString()}{' '}
                    {new Date(notification.Timestamp).toLocaleTimeString()}
                  </Typography>

                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                    sx={{ mt: 1, wordBreak: 'break-all' }}
                  >
                    ID: {notification.ID}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">No priority notifications found for the selected filter</Alert>
          </Grid>
        )}
      </Grid>

      {/* Info Box */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: '#e3f2fd' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Priority System:</strong> Notifications are sorted by importance - Placement (⭐⭐⭐),
          Result (⭐⭐), and Event (⭐). Within each category, newer notifications appear first.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PriorityNotificationsPage;
