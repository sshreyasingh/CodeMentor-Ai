import { Typography, Box, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CodeIcon from '@mui/icons-material/Code';

const MessageBubble = ({ message, isOwn }) => {
  const isCode = message.type === 'code';
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', mb: 1.5 }}>
      <Box
        sx={{
          maxWidth: '85%',
          px: isCode ? 1 : 1.5,
          py: isCode ? 0.75 : 1,
          borderRadius: '8px 8px 2px 8px',
          ...(isOwn
            ? { bgcolor: '#1d4ed8', color: '#fff' }
            : { bgcolor: '#1e293b', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.06)' }),
          overflow: 'hidden',
        }}
      >
        {!isOwn && message.sender && (
          <Typography
            variant="caption"
            sx={{
              color: message.sender.color || '#60a5fa',
              display: 'block',
              mb: 0.25,
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: 0.3,
            }}
          >
            {message.sender.name || 'User'}
          </Typography>
        )}

        {isCode ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75, pb: 0.5, borderBottom: 1, borderColor: isOwn ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)' }}>
              <Chip
                icon={<CodeIcon fontSize="small" />}
                label={message.language || 'Code'}
                size="small"
                variant="outlined"
                sx={{ height: 20, fontSize: 10, color: 'inherit', borderColor: isOwn ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)' }}
              />
              <Chip label={copied ? 'Copied!' : 'Copy'} size="small" onClick={handleCopyCode} clickable sx={{ height: 20, fontSize: 10, color: isOwn ? 'inherit' : '#93c5fd', cursor: 'pointer' }} />
            </Box>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 1,
                bgcolor: isOwn ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.35)',
                borderRadius: 1,
                fontSize: '0.75rem',
                fontFamily: '"Cascadia Code","Fira Code","JetBrains Mono",monospace',
                overflowX: 'auto',
                maxHeight: 220,
                overflowY: 'auto',
                color: 'inherit',
              }}
            >
              <code>{message.content}</code>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
            {message.content}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MessageBubble;
