import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TerminalIcon from '@mui/icons-material/Terminal';

const OutputPanel = ({ output, error, onClose }) => (
  <Box
    sx={{
      flex: '0 0 40%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      bgcolor: '#0c0f16',
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.5, py: 0.75, borderBottom: '1px solid rgba(255,255,255,0.06)', bgcolor: '#111827', flexShrink: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TerminalIcon sx={{ color: '#22c55e', fontSize: 16 }} />
        <Typography variant="caption" fontWeight={600} sx={{ color: '#94a3b8' }}>Output</Typography>
      </Box>
      <IconButton size="small" onClick={onClose} sx={{ color: '#64748B' }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
    <Box sx={{ flex: 1, minHeight: 0, p: 2, overflow: 'auto', fontFamily: '"JetBrains Mono","Cascadia Code","Fira Code",monospace', fontSize: 13 }}>
      {error ? (
        <Typography component="pre" sx={{ color: '#f87171', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontFamily: 'inherit' }}>{error}</Typography>
      ) : output ? (
        <Typography component="pre" sx={{ color: '#d1d5db', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontFamily: 'inherit', lineHeight: 1.6 }}>{output}</Typography>
      ) : (
        <Typography sx={{ color: '#475569', fontStyle: 'italic' }}>No output. Run your code to see results.</Typography>
      )}
    </Box>
  </Box>
);

export default OutputPanel;
