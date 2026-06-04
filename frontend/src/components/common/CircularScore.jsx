import { Box, Typography } from '@mui/material';

const CircularScore = ({ value, size = 130, strokeWidth = 9, color = '#818cf8', label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={`g-${label?.replace(/\s/g,'')}`} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={color} stopOpacity={0.6} /><stop offset="100%" stopColor={color} /></linearGradient>
          </defs>
          <circle cx={center} cy={center} r={radius} fill="none" stroke={color} strokeOpacity={0.08} strokeWidth={strokeWidth} />
          <circle cx={center} cy={center} r={radius} fill="none" stroke={`url(#g-${label?.replace(/\s/g,'')})`} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.4s ease-out' }} />
        </svg>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1, fontSize: 28 }}>{value}</Typography>
          <Typography variant="caption" sx={{ color: '#64748B', mt: 0.25 }}>/100</Typography>
        </Box>
      </Box>
      {label && <Typography variant="body2" fontWeight={600} sx={{ color: '#94A3B8', fontSize: 13 }}>{label}</Typography>}
    </Box>
  );
};

export default CircularScore;
