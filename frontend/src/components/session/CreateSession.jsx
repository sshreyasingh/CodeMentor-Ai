import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem,
} from '@mui/material';

const LANGUAGES = ['javascript', 'python', 'java', 'cpp', 'typescript', 'go', 'rust'];

const CreateSession = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({ title: '', description: '', language: 'javascript' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({ title: '', description: '', language: 'javascript' });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New Mentoring Session</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          name="title"
          margin="normal"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          margin="normal"
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          label="Language"
          name="language"
          select
          margin="normal"
          value={form.language}
          onChange={handleChange}
        >
          {LANGUAGES.map((lang) => (
            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSession;
