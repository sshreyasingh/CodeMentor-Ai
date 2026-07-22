import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import api from '../../api/axios';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import RoomHeader from './RoomHeader';
import { UserJoinedMessage, UserLeftMessage } from './SystemMessage';

const msgVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
};

const ChatWindow = ({ roomId, roomName, participants, onlineCount, systemMessages = [] }) => {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [reconnecting, setReconnecting] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();
  const bottomRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const typingTimers = useRef({});
  const shouldAutoScroll = useRef(true);

  const clearTyping = useCallback((userId) => {
    if (typingTimers.current[userId]) {
      clearTimeout(typingTimers.current[userId]);
      delete typingTimers.current[userId];
    }
    setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chat/${roomId}/messages`);
        setMessages(data.messages);
      } catch {
        // non-critical
      } finally {
        setMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [roomId]);

  const allMessages = useMemo(() => {
    const merged = [...messages];
    for (const sm of systemMessages) {
      if (!merged.find((m) => m._id === sm._id)) merged.push(sm);
    }
    merged.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    });
    return merged;
  }, [messages, systemMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', ({ message }) => {
      clearTyping(message.sender?._id);
      setMessages((prev) => [...prev, message]);
      shouldAutoScroll.current = true;
    });

    socket.on('typing', ({ userId, name }) => {
      if (typingTimers.current[userId]) clearTimeout(typingTimers.current[userId]);
      setTypingUsers((prev) => {
        if (prev.some((u) => u.userId === userId)) return prev;
        return [...prev, { userId, name }];
      });
      typingTimers.current[userId] = setTimeout(() => clearTyping(userId), 3000);
    });

    socket.on('stop-typing', ({ userId }) => clearTyping(userId));

    socket.on('disconnect', () => setReconnecting(true));
    socket.on('reconnect', () => setReconnecting(false));

    return () => {
      socket.off('new-message');
      socket.off('typing');
      socket.off('stop-typing');
      socket.off('disconnect');
      socket.off('reconnect');
      Object.values(typingTimers.current).forEach(clearTimeout);
    };
  }, [socket, clearTyping]);

  useEffect(() => {
    if (shouldAutoScroll.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages, typingUsers]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    shouldAutoScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  }, []);

  const handleSend = (content, type = 'text', language = null) => {
    if (!socket) return;
    shouldAutoScroll.current = true;
    socket.emit('send-message', { roomId, content, type, language });
  };

  const handleTypingStart = () => { if (socket) socket.emit('typing', { roomId }); };
  const handleTypingStop = () => { if (socket) socket.emit('stop-typing', { roomId }); };

  const typingOthers = typingUsers.filter((tu) => tu.userId !== user?._id);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <RoomHeader roomId={roomId} roomName={roomName} participants={participants} onlineCount={onlineCount} currentUserId={user?._id} onLeave={() => window.history.back()} />

      {reconnecting && (
        <Box sx={{ px: 2, py: 0.75, bgcolor: 'rgba(245,158,11,0.12)', borderBottom: '1px solid rgba(245,158,11,0.18)', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 600 }}>Reconnecting...</Typography>
        </Box>
      )}

      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{ flex: 1, overflow: 'auto', px: 2, py: 1.5, bgcolor: '#0d1117' }}
      >
        <AnimatePresence initial={false}>
          {messagesLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
              {[0, 1, 2].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1.5, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                  <Skeleton variant="circular" width={28} height={28} sx={{ bgcolor: 'rgba(255,255,255,0.04)', flexShrink: 0 }} />
                  <Box sx={{ maxWidth: '75%', flex: 1 }}>
                    <Skeleton variant="rounded" width={i % 2 === 0 ? '60%' : '75%'} height={i === 1 ? 48 : 32} sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 2 }} />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : allMessages.length === 0 && typingOthers.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Typography color="text.secondary" variant="body2">No messages yet. Start the conversation!</Typography>
              <Typography color="text.disabled" variant="caption" display="block" sx={{ mt: 1 }}>Send text or share code snippets</Typography>
            </Box>
          ) : (
            allMessages.map((msg, i) => {
              if (msg.type === 'system' || msg.type === 'leave') {
                const Comp = msg.type === 'leave' ? UserLeftMessage : UserJoinedMessage;
                return <Comp key={msg._id} name={msg.sender?.name || 'Someone'} />;
              }
              return (
                <motion.div key={msg._id || i} variants={msgVariants} initial="hidden" animate="visible" layout>
                  <MessageBubble message={msg} isOwn={msg.sender?._id === user?._id} />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </Box>

      <TypingIndicator users={typingOthers} />
      <ChatInput onSend={handleSend} onTyping={handleTypingStart} onStopTyping={handleTypingStop} />
    </Box>
  );
};

export default ChatWindow;
