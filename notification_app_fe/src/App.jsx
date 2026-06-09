import { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import NotificationsPage from './pages/NotificationsPage';
import PriorityNotificationsPage from './pages/PriorityNotificationsPage';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('all');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {currentPage === 'all' && <NotificationsPage />}
        {currentPage === 'priority' && <PriorityNotificationsPage />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
