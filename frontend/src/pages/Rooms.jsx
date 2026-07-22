import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert, Snackbar, IconButton, TextField, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import LoginIcon from '@mui/icons-material/Login';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import RoomCard from '../components/rooms/RoomCard';
import CreateRoomDialog from '../components/rooms/CreateRoomDialog';
import JoinRoomDialog from '../components/rooms/JoinRoomDialog';
import { SkeletonCard } from '../components/common/SkeletonLoader';

const Rooms = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success', action: null });

  const fetchRooms = useCallback(async () => { try { const { data } = await api.get('/rooms'); setRooms(data.rooms); } catch { showSnack('Failed to load rooms', 'error'); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchRooms(); }, [fetchRooms]);
  const showSnack = (message, severity = 'success', action = null) => setSnack({ open: true, message, severity, action });

  const handleCreate = async ({ roomId, name, description }) => {
    try { await api.post('/rooms', { roomId, name, description }); setCreateOpen(false); fetchRooms(); const link = `${window.location.origin}/join/${roomId}`; showSnack(`"${name}" created!`, 'success', <IconButton size="small" color="inherit" onClick={() => { navigator.clipboard.writeText(link); showSnack('Link copied!'); }}><ContentCopyIcon fontSize="small" /></IconButton>); }
    catch (err) { showSnack(err.response?.data?.message || 'Failed', 'error'); }
  };
  const handleJoin = async (roomId) => { try { await api.post(`/rooms/${roomId}/join`); setJoinOpen(false); navigate(`/session/${roomId}`); } catch (err) { showSnack(err.response?.data?.message || 'Failed', 'error'); } };
  const handleLeave = async (roomId) => { try { await api.post(`/rooms/${roomId}/leave`); showSnack(`Left room #${roomId}`); fetchRooms(); } catch (err) { showSnack(err.response?.data?.message || 'Failed', 'error'); } };
  const handleDelete = async (roomId) => { try { await api.delete(`/rooms/${roomId}`); showSnack(`Room #${roomId} deleted`); fetchRooms(); } catch (err) { showSnack(err.response?.data?.message || 'Failed', 'error'); } };

  const filtered = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.roomId.toLowerCase().includes(search.toLowerCase()));

  const myRooms = filtered.filter(r => r.owner?._id === user?._id);
  const joinedRooms = filtered.filter(r => r.owner?._id !== user?._id && r.participants?.some(p => p._id === user?._id));
  const availableRooms = filtered.filter(r => !r.participants?.some(p => p._id === user?._id));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 2, md: 4 }, maxWidth: 1440, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={700} sx={{ color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            <MeetingRoomIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 32 }} /> Rooms
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            {rooms.length} room{rooms.length !== 1 ? 's' : ''} total · {myRooms.length} owned · {joinedRooms.length} joined
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<LoginIcon />} onClick={() => setJoinOpen(true)} sx={{ borderRadius: 10 }}>Join Room</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)} sx={{ borderRadius: 10 }}>Create Room</Button>
        </Box>
      </Box>

      {/* Search */}
      {rooms.length > 0 && (
        <TextField
          placeholder="Search rooms by name or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748B', fontSize: 18 }} /></InputAdornment> }}
          sx={{ maxWidth: 420 }}
        />
      )}

      {loading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} lines={3} height={80} />
          ))}
        </Box>
      ) : rooms.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 16 }}>
          <Box sx={{ width: 72, height: 72, borderRadius: 2.5, bgcolor: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <MeetingRoomIcon sx={{ color: '#818cf8', fontSize: 36 }} />
          </Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#94A3B8', mb: 1 }}>No rooms yet</Typography>
          <Typography variant="body1" sx={{ color: '#64748B', mb: 4, maxWidth: 440, mx: 'auto', lineHeight: 1.6 }}>
            Create your first collaborative coding room or join one shared by a teammate. Rooms let you code together in real-time with live cursors, chat, and AI reviews.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button variant="outlined" size="large" startIcon={<LoginIcon />} onClick={() => setJoinOpen(true)} sx={{ borderRadius: 10 }}>Join a Room</Button>
            <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)} sx={{ borderRadius: 10, px: 3 }}>Create Your First Room</Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* My Rooms */}
          {myRooms.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', letterSpacing: '-0.01em' }}>My Rooms</Typography>
                <Box sx={{ px: 1.5, py: 0.25, bgcolor: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.15)', borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} sx={{ color: '#818cf8' }}>{myRooms.length}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
                {myRooms.map((room, i) => (
                  <Box key={room._id}>
                  <RoomCard room={room} currentUserId={user?._id} onJoin={handleJoin} onLeave={handleLeave} onDelete={handleDelete} onSnack={showSnack} index={i} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Joined Rooms */}
          {joinedRooms.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', letterSpacing: '-0.01em' }}>Joined Rooms</Typography>
                <Box sx={{ px: 1.5, py: 0.25, bgcolor: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} sx={{ color: '#22d3ee' }}>{joinedRooms.length}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
                {joinedRooms.map((room, i) => (
                  <Box key={room._id}>
                  <RoomCard room={room} currentUserId={user?._id} onJoin={handleJoin} onLeave={handleLeave} onDelete={handleDelete} onSnack={showSnack} index={i} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Available Rooms */}
          {availableRooms.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#FFFFFF', letterSpacing: '-0.01em' }}>Available Rooms</Typography>
                <Box sx={{ px: 1.5, py: 0.25, bgcolor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 2 }}>
                  <Typography variant="caption" fontWeight={600} sx={{ color: '#22c55e' }}>{availableRooms.length}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
                {availableRooms.map((room, i) => (
                  <Box key={room._id}>
                  <RoomCard room={room} currentUserId={user?._id} onJoin={handleJoin} onLeave={handleLeave} onDelete={handleDelete} onSnack={showSnack} index={i} />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* No results from search */}
          {filtered.length === 0 && search && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body1" sx={{ color: '#64748B' }}>No rooms match "{search}"</Typography>
            </Box>
          )}
        </Box>
      )}

      <CreateRoomDialog open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <JoinRoomDialog open={joinOpen} onClose={() => setJoinOpen(false)} onJoin={handleJoin} />
      <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snack.severity} onClose={() => setSnack(p => ({ ...p, open: false }))} variant="filled" action={snack.action}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Rooms;
