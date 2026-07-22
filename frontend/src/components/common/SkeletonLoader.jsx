import { Box, Skeleton } from '@mui/material';

export const SkeletonCard = ({ lines = 3, height, width }) => (
  <Box
    sx={{
      p: 2.5,
      borderRadius: 3,
      bgcolor: 'rgba(12,18,35,0.85)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <Skeleton variant="rounded" width="30%" height={14} sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.04)' }} />
    <Skeleton variant="rounded" width="60%" height={28} sx={{ mb: 1.5, bgcolor: 'rgba(255,255,255,0.04)' }} />
    <Skeleton variant="rounded" width="100%" height={height || 40} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
    {Array.from({ length: lines - 1 }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={`${70 - i * 10}%`}
        sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.04)' }}
      />
    ))}
  </Box>
);

export const SkeletonChart = ({ height = 120 }) => (
  <Box
    sx={{
      p: 3,
      borderRadius: 3,
      bgcolor: 'rgba(12,18,35,0.85)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <Skeleton variant="rounded" width="35%" height={18} sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.04)' }} />
    <Skeleton variant="rounded" width="55%" height={14} sx={{ mb: 2.5, bgcolor: 'rgba(255,255,255,0.04)' }} />
    <Skeleton
      variant="rounded"
      width="100%"
      height={height}
      sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
    />
  </Box>
);

export const SkeletonText = ({ lines = 3, lineWidths }) => (
  <Box>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={lineWidths?.[i] || (i === lines - 1 ? '60%' : '100%')}
        height={14}
        sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.04)' }}
      />
    ))}
  </Box>
);

export const SkeletonAvatar = ({ size = 80 }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    sx={{ bgcolor: 'rgba(255,255,255,0.04)' }}
  />
);
