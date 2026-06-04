import { Box, Typography } from '@mui/material';

const Footer = () => (
  <Box component="footer" sx={{ py: 3, mt: 'auto', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', bgcolor: '#050816' }}>
    <Typography variant="caption" sx={{ color: '#475569' }}>&copy; {new Date().getFullYear()} CodeMentor. All rights reserved.</Typography>
  </Box>
);

export default Footer;
