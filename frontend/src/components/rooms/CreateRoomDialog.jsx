import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const CreateRoomDialog = ({ open, onClose, onCreate }) => {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    setError('');
    const ti = roomId.trim(), tn = name.trim();
    if (!ti || !tn) { setError('Room ID and name are required'); return; }
    if (!/^[a-zA-Z0-9_-]+$/.test(ti)) { setError('Only letters, numbers, hyphens, underscores'); return; }
    onCreate({ roomId: ti, name: tn, description: description.trim() });
    setRoomId(''); setName(''); setDescription('');
  };
  const close = () => { setRoomId(''); setName(''); setDescription(''); setError(''); onClose(); };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 0, fontSize: 20, fontWeight: 700 }}>Create a New Room</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField autoFocus fullWidth label="Room ID" margin="dense" value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="my-awesome-room" error={!!error} helperText={error || 'Letters, numbers, hyphens, underscores'} />
        <TextField fullWidth label="Room Name" margin="dense" value={name} onChange={e => setName(e.target.value)} placeholder="My Awesome Room" />
        <TextField fullWidth label="Description (optional)" margin="dense" value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this room for?" multiline maxRows={3} inputProps={{ maxLength: 200 }} helperText={`${description.length}/200`} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={close}>Cancel</Button><Button onClick={submit} variant="contained">Create</Button></DialogActions>
    </Dialog>
  );
};

export default CreateRoomDialog;
