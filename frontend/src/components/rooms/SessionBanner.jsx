import { useState } from 'react';
import { Box, Typography, Chip, Button, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People';

const SessionBanner = ({ room, participants, onlineCount }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/join/${room?.roomId}`);
      setCopied(true);
    } catch { setCopied(true); }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2.5,
        py: 1.25,
        bgcolor: '#111827',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', minWidth: 0 }}>
        <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ color: '#f1f5f9', maxWidth: 280 }}>
          {room?.name || 'Room'}
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748b', bgcolor: 'rgba(255,255,255,0.04)', px: 1, py: 0.25, borderRadius: 1 }}>
          #{room?.roomId}
        </Typography>
        {room?.language && (
          <Chip icon={<LanguageIcon sx={{ fontSize: 14 }} />} label={room.language} size="small" variant="outlined" sx={{ height: 24, fontSize: 11, borderColor: 'rgba(255,255,255,0.1)', color: '#94a3b8' }} />
        )}
        <Chip icon={<PeopleIcon sx={{ fontSize: 14 }} />} label={`${onlineCount} online`} size="small" color="primary" variant="outlined" sx={{ height: 24, fontSize: 11 }} />
      </Box>

      <Button
        size="small"
        variant="contained"
        startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
        onClick={handleCopyLink}
        sx={{ fontSize: 12, py: 0.5, px: 1.75, textTransform: 'none', borderRadius: 1.5 }}
      >
        Share Invite
      </Button>

      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setCopied(false)} sx={{ borderRadius: 1.5 }}>
          Invite link copied!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SessionBanner;
