import { Routes, Route, Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Session from './pages/Session';
import JoinRoom from './pages/JoinRoom';
import NotFound from './pages/NotFound';

const PublicLayout = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <Box component="main" sx={{ flex: 1 }}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

const AppLayout = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join/:roomId" element={<JoinRoom />} />
    </Route>

    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/session/:id" element={<Session />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
