import { Box, Typography } from '@mui/material';

const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  const MAX_DISPLAY = 3;
  const names = users.slice(0, MAX_DISPLAY).map((u) => u.name.split(' ')[0]);
  const remaining = users.length - MAX_DISPLAY;

  let text;
  if (users.length === 1) {
    text = `${names[0]} is typing...`;
  } else if (users.length === 2) {
    text = `${names[0]} and ${names[1]} are typing...`;
  } else if (remaining > 0) {
    text = `${names.join(', ')} and ${remaining} more are typing...`;
  } else {
    text = `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]} are typing...`;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, minHeight: 28, bgcolor: '#0d1117' }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              opacity: 0.4,
              animation: `typingBounce 1.4s ${i * 0.2}s infinite`,
              '@keyframes typingBounce': {
                '0%, 60%, 100%': { transform: 'translateY(0)' },
                '30%': { transform: 'translateY(-5px)', opacity: 1 },
              },
            }}
          />
        ))}
      </Box>
      <Typography variant="caption" color="#64748b" sx={{ fontStyle: 'italic' }}>
        {text}
      </Typography>
    </Box>
  );
};

export default TypingIndicator;
