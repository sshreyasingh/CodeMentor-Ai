import { Box, Typography, LinearProgress } from '@mui/material';

const ScoreCard = ({ label, score, color }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2" fontWeight={500} sx={{ color: '#94A3B8', fontSize: 13 }}>{label}</Typography>
      <Typography variant="body2" fontWeight={700} sx={{ color, fontSize: 13 }}>{score}/100</Typography>
    </Box>
    <LinearProgress variant="determinate" value={score} sx={{ height: 6 }} />
  </Box>
);

export default ScoreCard;
