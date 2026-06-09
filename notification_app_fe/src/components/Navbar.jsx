import React from 'react';
import { AppBar, Toolbar, Typography, Button, Badge, Box, Container } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';

export default function Navbar({ currentPage, onPageChange }) {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1976d2', mb: 4 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', letterSpacing: '0.5px', cursor: 'pointer' }}
            onClick={() => onPageChange('all')}
          >
            Campus Notifications
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
            <Button
              color="inherit"
              onClick={() => onPageChange('all')}
              startIcon={<NotificationsIcon />}
              sx={{
                borderBottom: currentPage === 'all' ? '3px solid white' : 'none',
                borderRadius: 0,
                px: 2,
              }}
            >
              All
            </Button>
            <Button
              color="inherit"
              onClick={() => onPageChange('priority')}
              startIcon={<LabelImportantIcon />}
              sx={{
                borderBottom: currentPage === 'priority' ? '3px solid white' : 'none',
                borderRadius: 0,
                px: 2,
              }}
            >
              Priority Inbox
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}