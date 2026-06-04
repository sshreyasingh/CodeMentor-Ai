import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <CircularProgress size={36} thickness={4} />
  </Box>
);

export default LoadingSpinner;
