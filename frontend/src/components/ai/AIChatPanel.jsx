import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import api from '../../api/axios';

const AIChatPanel = ({ code, language }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question) return;

    const userMsg = { role: 'user', content: question, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role,
        content: m.content,
        codeContext: m.role === 'user' ? (m._codeContext || '') : undefined,
      }));

    const lastUserMsg = { ...userMsg, _codeContext: code };

    try {
      const { data } = await api.post('/ai/chat', {
        code,
        language,
        question,
        history,
      });

      const aiMsg = {
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, lastUserMsg, aiMsg]);
    } catch (err) {
      const errMsg = {
        role: 'assistant',
        content: `Error: ${err.response?.data?.reply || 'Failed to get response'}`,
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, lastUserMsg, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatContent = (text) => {
    return text
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, codeBlock) => {
        return `<pre style="background:#0d1117;color:#e6edf3;padding:10px;border-radius:6px;overflow-x:auto;font-size:12px;font-family:monospace;margin:8px 0"><code>${escapeHtml(codeBlock.trim())}</code></pre>`;
      })
      .replace(/`([^`]+)`/g, '<code style="background:#1e293b;padding:1px 5px;border-radius:3px;font-size:12px">$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const escapeHtml = (str) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
          <SmartToyIcon sx={{ fontSize: 18 }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            AI Assistant
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Powered by DeepSeek R1
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <SmartToyIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary" variant="body2">
              Ask me anything about your code.
              <br />
              I can help debug, explain, and suggest improvements.
            </Typography>
          </Box>
        )}

        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              gap: 1.5,
              mb: 2,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main',
                flexShrink: 0,
              }}
            >
              {msg.role === 'user' ? (
                <Typography variant="caption">U</Typography>
              ) : (
                <SmartToyIcon sx={{ fontSize: 16 }} />
              )}
            </Avatar>

            <Box sx={{ maxWidth: '85%' }}>
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: msg.role === 'user' ? 'primary.dark' : msg.isError ? 'error.dark' : 'background.default',
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body2"
                  component="div"
                  sx={{ lineHeight: 1.6, wordBreak: 'break-word', fontSize: 13 }}
                  dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
                />
              </Paper>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ display: 'block', mt: 0.25, textAlign: msg.role === 'user' ? 'right' : 'left', px: 0.5 }}
              >
                {formatTime(msg.timestamp)}
              </Typography>
            </Box>
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', flexShrink: 0 }}>
              <SmartToyIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Paper sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', gap: 0.8 }}>
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor: 'text.disabled',
                      animation: 'aiPulse 1.2s infinite',
                      animationDelay: `${i * 0.2}s`,
                      '@keyframes aiPulse': {
                        '0%, 100%': { opacity: 0.3 },
                        '50%': { opacity: 1 },
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box
        component="form"
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        sx={{ display: 'flex', gap: 1, p: 1.5, borderTop: 1, borderColor: 'divider' }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Ask about your code..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          multiline
          maxRows={4}
          sx={{ '& .MuiOutlinedInput-root': { fontSize: 13 } }}
        />
        <IconButton type="submit" color="primary" disabled={!input.trim() || loading} sx={{ alignSelf: 'flex-end' }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AIChatPanel;
