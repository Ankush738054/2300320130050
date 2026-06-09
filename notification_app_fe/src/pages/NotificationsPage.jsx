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
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const NOTIFICATIONS_PER_PAGE = 10;

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('all');
  const [viewedNotifications, setViewedNotifications] = useState(new Set());

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, selectedType, viewedNotifications]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/priority-notifications?limit=1000`);
      const allNotifications = response.data.data || [];
      setNotifications(allNotifications);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
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
    setCurrentPage(1);
  };

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  const handleNotificationView = (id) => {
    setViewedNotifications(prev => new Set([...prev, id]));
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * NOTIFICATIONS_PER_PAGE,
    currentPage * NOTIFICATIONS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredNotifications.length / NOTIFICATIONS_PER_PAGE);

  const getChipColor = (type) => {
    const colors = {
      'Placement': 'success',
      'Result': 'info',
      'Event': 'warning',
    };
    return colors[type] || 'default';
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
        All Notifications
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter by Type
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
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
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Showing {paginatedNotifications.length} of {filteredNotifications.length} notifications
        </Typography>
      </Paper>

      {/* Notifications Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {paginatedNotifications.length > 0 ? (
          paginatedNotifications.map(notification => (
            <Grid item xs={12} key={notification.ID}>
              <Card
                onClick={() => handleNotificationView(notification.ID)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: viewedNotifications.has(notification.ID)
                    ? '#f5f5f5'
                    : '#fff',
                  borderLeft: `4px solid ${
                    notification.Type === 'Placement'
                      ? '#4caf50'
                      : notification.Type === 'Result'
                      ? '#2196f3'
                      : '#ff9800'
                  }`,
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                        <Chip
                          label={notification.Type}
                          color={getChipColor(notification.Type)}
                          size="small"
                        />
                        {!viewedNotifications.has(notification.ID) && (
                          <Chip label="NEW" color="primary" size="small" />
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {notification.Message}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {notification.ID}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                      {new Date(notification.Timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">No notifications found</Alert>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default NotificationsPage;
