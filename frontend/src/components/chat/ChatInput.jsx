import { useState, useRef } from 'react';
import { Box, TextField, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CodeIcon from '@mui/icons-material/Code';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
];

const ChatInput = ({ onSend, onTyping, onStopTyping }) => {
  const [text, setText] = useState('');
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [codeText, setCodeText] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const typingTimeout = useRef(null);
  const wasTyping = useRef(false);

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value && !wasTyping.current) { wasTyping.current = true; onTyping?.(); }
    else if (!e.target.value && wasTyping.current) { wasTyping.current = false; onStopTyping?.(); }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    if (e.target.value) {
      typingTimeout.current = setTimeout(() => { wasTyping.current = false; onStopTyping?.(); }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim(), 'text');
    setText('');
    wasTyping.current = false;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    onStopTyping?.();
  };

  const handleOpenCodeDialog = () => { setCodeDialogOpen(true); setCodeText(''); setCodeLanguage('javascript'); };
  const handleCloseCodeDialog = () => { setCodeDialogOpen(false); setCodeText(''); };
  const handleSendCode = () => {
    if (!codeText.trim()) return;
    onSend(codeText.trim(), 'code', codeLanguage);
    setCodeDialogOpen(false);
    setCodeText('');
    wasTyping.current = false;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    onStopTyping?.();
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 0.75, p: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: '#0f172adb', backdropFilter: 'blur(8px)' }}>
        <IconButton onClick={handleOpenCodeDialog} size="small" sx={{ color: '#93c5fd', '&:hover': { bgcolor: 'rgba(99,102,241,0.15)' } }}>
          <CodeIcon fontSize="small" />
        </IconButton>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={text}
          onChange={handleChange}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#1e293b',
              fontSize: 13,
              '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
              '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
              '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
            '& .MuiOutlinedInput-input': { color: '#e2e8f0', '&::placeholder': { color: '#64748b', opacity: 1 } },
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!text.trim()}
          sx={{
            bgcolor: text.trim() ? 'primary.main' : 'transparent',
            color: text.trim() ? '#fff' : '#475569',
            '&:hover': { bgcolor: text.trim() ? 'primary.dark' : 'transparent' },
            transition: 'all 0.2s',
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>

      <Dialog open={codeDialogOpen} onClose={handleCloseCodeDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1e293b', color: '#e2e8f0' } }}>
        <DialogTitle>Share Code Snippet</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mb: 2, mt: 1 }}>
            <InputLabel sx={{ color: '#94a3b8' }}>Language</InputLabel>
            <Select value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)} label="Language" sx={{ color: '#e2e8f0', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' } }}>
              {LANGUAGES.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>{lang.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth multiline rows={8}
            placeholder="Paste your code here..."
            value={codeText}
            onChange={(e) => setCodeText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: '"Cascadia Code","Fira Code","JetBrains Mono",monospace',
                fontSize: '0.875rem',
                bgcolor: '#0f172a',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
              },
              '& .MuiOutlinedInput-input': { color: '#e2e8f0' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCodeDialog} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button onClick={handleSendCode} variant="contained" disabled={!codeText.trim()} startIcon={<SendIcon />}>Share Code</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatInput;
