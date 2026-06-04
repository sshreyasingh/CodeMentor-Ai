import { Box, Typography, Chip, IconButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

const RoomHeader = ({ roomId, roomName, participants, onlineCount, currentUserId, onLeave }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 2,
      py: 1.25,
      borderBottom: 1,
      borderColor: 'divider',
      bgcolor: '#0f172adb',
      backdropFilter: 'blur(8px)',
      gap: 1,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
      {roomName && (
        <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ maxWidth: 140, color: '#e2e8f0' }}>
          {roomName}
        </Typography>
      )}
      <Typography variant="subtitle2" fontWeight={600} noWrap sx={{ fontFamily: 'monospace', color: roomName ? 'text.secondary' : '#e2e8f0' }}>
        #{roomId}
      </Typography>
      <Chip
        icon={<PeopleIcon sx={{ fontSize: 14 }} />}
        label={`${onlineCount}`}
        size="small"
        color="primary"
        variant="outlined"
        sx={{ height: 22, fontSize: 11, minWidth: 0, px: 0.5 }}
      />
    </Box>

    <IconButton size="small" onClick={onLeave} sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444' } }}>
      <LogoutIcon fontSize="small" />
    </IconButton>
  </Box>
);

export default RoomHeader;
