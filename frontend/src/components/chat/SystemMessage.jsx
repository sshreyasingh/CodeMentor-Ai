import { Box, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const SystemMessage = ({ icon, children }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', my: 1.5 }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        py: 0.5,
        borderRadius: 3,
        bgcolor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {icon}
      <Typography variant="caption" color="text.secondary">{children}</Typography>
    </Box>
  </Box>
);

export const UserJoinedMessage = ({ name }) => (
  <SystemMessage icon={<PersonAddIcon sx={{ fontSize: 15, color: '#22c55e' }} />}>
    {name} joined the room
  </SystemMessage>
);

export const UserLeftMessage = ({ name }) => (
  <SystemMessage icon={<PersonRemoveIcon sx={{ fontSize: 15, color: '#ef4444' }} />}>
    {name} left the room
  </SystemMessage>
);
