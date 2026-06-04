import { Box, Typography } from '@mui/material';

const LANG_NAMES = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  cpp: 'C++',
  go: 'Go',
};

const EditorStatusBar = ({ cursorPos, language, selectionCount, zoom, theme }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 1.5,
      py: 0,
      borderTop: '1px solid rgba(255,255,255,0.06)',
      bgcolor: '#007acc',
      minHeight: 24,
      flexShrink: 0,
      userSelect: 'none',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <StatusItem>Ln {cursorPos.line}, Col {cursorPos.col}</StatusItem>
      {selectionCount > 0 && (
        <StatusItem>{selectionCount} selected</StatusItem>
      )}
    </Box>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      <StatusItem>Spaces: 2</StatusItem>
      <StatusItem>UTF-8</StatusItem>
      <StatusItem>{LANG_NAMES[language] || language}</StatusItem>
      {zoom !== 0 && <StatusItem>{zoom > 0 ? '+' : ''}{zoom * 10}%</StatusItem>}
      <StatusItem>{theme === 'vs-dark' ? 'Dark' : theme === 'vs' ? 'Light' : 'HC'}</StatusItem>
    </Box>
  </Box>
);

const StatusItem = ({ children }) => (
  <Typography
    variant="caption"
    sx={{
      color: '#ffffffcc',
      fontSize: 10,
      px: 1,
      py: 0.1,
      borderRight: '1px solid rgba(255,255,255,0.15)',
      cursor: 'default',
      '&:last-child': { borderRight: 'none' },
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </Typography>
);

export default EditorStatusBar;
