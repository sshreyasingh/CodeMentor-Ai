import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050816' }}>
    <Sidebar />
    <Box component="main" sx={{ flex: 1, ml: { xs: 0, md: 0 }, mt: { xs: 7, md: 0 }, overflow: 'auto' }}>
      {children}
    </Box>
  </Box>
);

export default DashboardLayout;
