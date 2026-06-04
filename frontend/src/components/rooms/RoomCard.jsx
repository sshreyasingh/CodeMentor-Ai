import { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, AvatarGroup, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tooltip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from '../../api/axios';

const LANGUAGE_COLORS = { typescript: '#3178c6', python: '#3776ab', go: '#00add8', javascript: '#f7df1e', java: '#007396', cpp: '#00599c' };

const RoomCard = ({ room, currentUserId, onJoin, onLeave, onDelete, onSnack, index = 0 }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const isOwner = room.owner?._id === currentUserId;
  const isParticipant = room.participants?.some(p => p._id === currentUserId);
  const count = room.participants?.length || 0;
  const langColor = LANGUAGE_COLORS[room.language?.toLowerCase()] || '#6366f1';
  const created = room.createdAt ? new Date(room.createdAt) : null;

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/join/${room.roomId}`);
    onSnack?.('Invite link copied to clipboard!');
  };

  const handleDelete = () => {
    setDeleteDialogOpen(false);
    onDelete?.(room.roomId);
  };

  const handleAnalyze = async (e) => {
    e.stopPropagation();
    if (!room.code || room.code === '// Start coding...\n') {
      onSnack?.('Room has no code to analyze yet', 'warning');
      return;
    }
    setAnalyzing(true);
    try {
      await api.post('/review', { code: room.code, language: room.language || 'javascript' });
      onSnack?.('AI analysis complete! Check Insights & Analytics');
    } catch (err) {
      onSnack?.(err.response?.data?.message || 'Analysis failed', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.3 }}>
        <Card sx={{ borderRadius: 3, display: 'flex', flexDirection: 'column', transition: 'all 0.25s', '&:hover': { transform: 'translateY(-2px)', borderColor: 'rgba(129,140,248,0.3)' } }}>
          <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: `${langColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: langColor, flexShrink: 0 }}>
                    {room.language?.[0]?.toUpperCase() || 'J'}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ color: '#FFFFFF', fontSize: 15, letterSpacing: '-0.01em' }}>{room.name}</Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#475569', fontSize: 11 }}>#{room.roomId}</Typography>
                  </Box>
                </Box>
                {room.description && (
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 1, ml: 6.5, fontSize: 12, lineHeight: 1.5 }}>
                    {room.description.length > 80 ? `${room.description.slice(0, 80)}...` : room.description}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.75 }}>
                {isOwner && <Chip label="Owner" size="small" color="primary" sx={{ height: 22, fontSize: 10, fontWeight: 600 }} />}
                {!isOwner && isParticipant && <Chip label="Member" size="small" variant="outlined" sx={{ height: 22, fontSize: 10, borderColor: 'rgba(255,255,255,0.1)', color: '#64748B' }} />}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, ml: 6.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LanguageIcon sx={{ fontSize: 13, color: '#64748B' }} />
                <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'capitalize', fontSize: 11 }}>{room.language || 'javascript'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PeopleIcon sx={{ fontSize: 13, color: '#64748B' }} />
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: 11 }}>{count} member{count !== 1 ? 's' : ''}</Typography>
              </Box>
              {created && (
                <Typography variant="caption" sx={{ color: '#475569', fontSize: 10, ml: 'auto' }}>
                  {created.toLocaleDateString()}
                </Typography>
              )}
            </Box>

            <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 26, height: 26, fontSize: 11, border: '2px solid #0B1120' } }}>
                {room.participants?.map(p => <Avatar key={p._id} src={p.avatar} alt={p.name} />)}
              </AvatarGroup>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Copy invite link">
                  <IconButton size="small" onClick={handleCopyLink} sx={{ color: '#64748B', '&:hover': { color: '#818cf8', bgcolor: 'rgba(129,140,248,0.08)' } }}>
                    <ContentCopyIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
                {isParticipant && (
                  <Tooltip title="AI analyze this room's code">
                    <IconButton size="small" onClick={handleAnalyze} disabled={analyzing} sx={{ color: '#64748B', '&:hover': { color: '#22d3ee', bgcolor: 'rgba(34,211,238,0.08)' } }}>
                      {analyzing ? <CircularProgress size={15} sx={{ color: '#22d3ee' }} /> : <AutoAwesomeIcon sx={{ fontSize: 15 }} />}
                    </IconButton>
                  </Tooltip>
                )}
                {isOwner && (
                  <Tooltip title="Delete room">
                    <IconButton size="small" onClick={() => setDeleteDialogOpen(true)} sx={{ color: '#64748B', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' } }}>
                      <DeleteIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                )}
                {isParticipant ? (
                  <>
                    <Button size="small" variant="outlined" onClick={() => navigate(`/session/${room.roomId}`)} sx={{ fontSize: 12, py: 0.25, borderRadius: 8, ml: 0.5 }}>Enter</Button>
                    {!isOwner && <Button size="small" color="error" onClick={() => onLeave(room.roomId)} sx={{ fontSize: 12, py: 0.25, borderRadius: 8 }}>Leave</Button>}
                  </>
                ) : (
                  <Button size="small" variant="contained" onClick={() => onJoin(room.roomId)} sx={{ fontSize: 12, py: 0.25, borderRadius: 8, ml: 0.5 }}>Join</Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, pb: 0 }}>Delete Room</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
            Are you sure you want to delete <strong style={{ color: '#FFFFFF' }}>#{room.roomId}</strong>? This action cannot be undone. All code and chat history will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete Room</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomCard;
