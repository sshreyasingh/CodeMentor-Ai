import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

const JoinRoomDialog = ({ open, onClose, onJoin }) => {
  const [roomId, setRoomId] = useState('');

  const submit = () => { const t = roomId.trim(); if (t) { onJoin(t); setRoomId(''); } };
  const close = () => { setRoomId(''); onClose(); };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pb: 0, fontSize: 20, fontWeight: 700 }}>Join a Room</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>Enter a room ID shared by your teammate to join instantly.</Typography>
        <TextField autoFocus fullWidth label="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="Enter room ID" onKeyDown={e => e.key === 'Enter' && submit()} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={close}>Cancel</Button><Button onClick={submit} variant="contained" disabled={!roomId.trim()}>Join</Button></DialogActions>
    </Dialog>
  );
};

export default JoinRoomDialog;
