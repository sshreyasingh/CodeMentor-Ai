const chatController = require('../controllers/chat.controller');
const Room = require('../models/room.model');

// In-memory state for active rooms (for fast access)
const roomCodeState = new Map();
const roomLanguageState = new Map();
const roomCursorState = new Map(); // Track cursor positions per room

// Generate a color for each user based on their ID
const getUserColor = (userId) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8B739', '#52C4B0', '#FF6F61', '#6B5B95', '#88B04B',
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getOnlineCount = async (io, roomId) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? room.size : 0;
};

const broadcastOnlineCount = async (io, roomId) => {
  const count = await getOnlineCount(io, roomId);
  io.to(roomId).emit('online-count', { roomId, count });
};

const chatHandler = (io, socket) => {
  console.log(`[Socket] Handler registered for user: ${socket.userName}`);

  socket.on('join-room', async ({ roomId }) => {
    try {
      console.log(`[Socket] ${socket.userName} attempting to join room: ${roomId}`);
      
      const room = await Room.findOne({ roomId });
      if (!room) {
        console.log(`[Socket] Room not found: ${roomId}`);
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      const isMember = room.participants.some(
        (p) => p.toString() === socket.userId
      );
      if (!isMember) {
        console.log(`[Socket] ${socket.userName} is not a member of room: ${roomId}`);
        socket.emit('error', { message: 'You are not a member of this room' });
        return;
      }

      // Leave previous room if any
      if (socket.currentRoom) {
        console.log(`[Socket] ${socket.userName} leaving previous room: ${socket.currentRoom}`);
        socket.leave(socket.currentRoom);
        
        // Remove cursor state for this user from previous room
        const prevCursors = roomCursorState.get(socket.currentRoom) || new Map();
        prevCursors.delete(socket.userId);
        if (prevCursors.size === 0) {
          roomCursorState.delete(socket.currentRoom);
        } else {
          roomCursorState.set(socket.currentRoom, prevCursors);
        }
        
        // Notify others that cursor is removed
        io.to(socket.currentRoom).emit('cursor-remove', {
          userId: socket.userId,
        });
        
        io.to(socket.currentRoom).emit('user-left', {
          userId: socket.userId,
          name: socket.userName,
          avatar: socket.userAvatar,
        });
        await broadcastOnlineCount(io, socket.currentRoom);
      }

      // Join new room
      socket.join(roomId);
      socket.currentRoom = roomId;
      socket.userColor = getUserColor(socket.userId);
      console.log(`[Socket] ${socket.userName} joined room: ${roomId}`);

      // Notify others
      socket.to(roomId).emit('user-joined', {
        userId: socket.userId,
        name: socket.userName,
        avatar: socket.userAvatar,
        color: socket.userColor,
      });

      // Get participants list with colors
      const participants = [];
      const sockets = await io.in(roomId).fetchSockets();
      for (const s of sockets) {
        participants.push({
          userId: s.userId,
          name: s.userName,
          avatar: s.userAvatar,
          color: s.userColor || getUserColor(s.userId),
        });
      }

      // Get code from memory or MongoDB
      let currentCode = roomCodeState.get(roomId);
      let currentLanguage = roomLanguageState.get(roomId);
      
      // If not in memory, load from MongoDB
      if (currentCode === undefined) {
        currentCode = room.code || '// Start coding...\n';
        roomCodeState.set(roomId, currentCode);
      }
      if (currentLanguage === undefined) {
        currentLanguage = room.language || 'javascript';
        roomLanguageState.set(roomId, currentLanguage);
      }
      
      // Get existing cursor positions for this room
      const cursors = roomCursorState.get(roomId);
      const cursorPositions = cursors ? Array.from(cursors.values()) : [];
      
      console.log(`[Socket] Sending room state to ${socket.userName}, code length: ${currentCode?.length}`);
      
      socket.emit('joined-room', {
        roomId,
        participants,
        code: currentCode,
        language: currentLanguage,
        cursorPositions,
        myColor: socket.userColor,
      });
      
      await broadcastOnlineCount(io, roomId);
    } catch (error) {
      console.error('[Socket] join-room error:', error.message);
    }
  });

  socket.on('leave-room', async ({ roomId }) => {
    try {
      console.log(`[Socket] ${socket.userName} leaving room: ${roomId}`);
      socket.leave(roomId);

      if (socket.currentRoom === roomId) {
        socket.currentRoom = null;
      }

      // Remove cursor state
      const cursors = roomCursorState.get(roomId);
      if (cursors) {
        cursors.delete(socket.userId);
        if (cursors.size === 0) {
          roomCursorState.delete(roomId);
        }
      }
      
      // Notify others that cursor is removed
      io.to(roomId).emit('cursor-remove', {
        userId: socket.userId,
      });

      io.to(roomId).emit('user-left', {
        userId: socket.userId,
        name: socket.userName,
        avatar: socket.userAvatar,
      });

      await broadcastOnlineCount(io, roomId);
      socket.emit('left-room', { roomId });
    } catch (error) {
      console.error('[Socket] leave-room error:', error.message);
    }
  });

  socket.on('code-change', async ({ roomId, code }) => {
    if (typeof code !== 'string') return;

    try {
      console.log(`[Socket] ${socket.userName} changed code in room: ${roomId}, length: ${code?.length}`);
      
      // Update in-memory state
      roomCodeState.set(roomId, code);
      
      // Get language
      const language = roomLanguageState.get(roomId) || 'javascript';
      
      // Broadcast to ALL users in room (including sender)
      io.to(roomId).emit('code-update', {
        roomId,
        code,
        userId: socket.userId,
        name: socket.userName,
      });
      
      // Persist to MongoDB
      await Room.findOneAndUpdate(
        { roomId },
        { code, language, updatedAt: new Date() },
        { new: true }
      );
      console.log(`[Socket] Code saved to MongoDB for room: ${roomId}`);
    } catch (error) {
      console.error('[Socket] code-change error:', error.message);
    }
  });

  socket.on('language-change', async ({ roomId, language }) => {
    if (typeof language !== 'string') return;

    try {
      console.log(`[Socket] ${socket.userName} changed language to: ${language}`);
      
      // Update in-memory state
      roomLanguageState.set(roomId, language);
      
      // Update MongoDB
      await Room.findOneAndUpdate(
        { roomId },
        { language, updatedAt: new Date() },
        { new: true }
      );
      
      // Broadcast to ALL users
      io.to(roomId).emit('language-update', {
        roomId,
        language,
        userId: socket.userId,
      });
    } catch (error) {
      console.error('[Socket] language-change error:', error.message);
    }
  });

  // Cursor tracking events
  socket.on('cursor-move', ({ roomId, position, selection }) => {
    if (!roomId || !position) return;
    
    try {
      // Store cursor position
      let cursors = roomCursorState.get(roomId);
      if (!cursors) {
        cursors = new Map();
        roomCursorState.set(roomId, cursors);
      }
      
      cursors.set(socket.userId, {
        userId: socket.userId,
        name: socket.userName,
        color: socket.userColor || getUserColor(socket.userId),
        position,
        selection,
        timestamp: Date.now(),
      });
      
      // Broadcast to other users (not sender)
      socket.to(roomId).emit('cursor-update', {
        userId: socket.userId,
        name: socket.userName,
        color: socket.userColor || getUserColor(socket.userId),
        position,
        selection,
      });
    } catch (error) {
      console.error('[Socket] cursor-move error:', error.message);
    }
  });

  socket.on('cursor-selection', ({ roomId, selection }) => {
    if (!roomId || !selection) return;
    
    try {
      const cursors = roomCursorState.get(roomId);
      if (cursors && cursors.has(socket.userId)) {
        const cursorData = cursors.get(socket.userId);
        cursorData.selection = selection;
        cursorData.timestamp = Date.now();
        
        // Broadcast to other users
        socket.to(roomId).emit('cursor-selection-update', {
          userId: socket.userId,
          name: socket.userName,
          color: socket.userColor || getUserColor(socket.userId),
          selection,
        });
      }
    } catch (error) {
      console.error('[Socket] cursor-selection error:', error.message);
    }
  });

  socket.on('send-message', async ({ roomId, content, type, language }) => {
    try {
      const msg = await chatController.saveMessage({
        session: roomId,
        sender: socket.userId,
        content,
        type: type || 'text',
        language: language || null,
      });

      io.to(roomId).emit('new-message', { message: msg });
    } catch (error) {
      console.error('[Socket] send-message error:', error.message);
    }
  });

  socket.on('typing', ({ roomId }) => {
    socket.to(roomId).emit('typing', {
      roomId,
      userId: socket.userId,
      name: socket.userName,
    });
  });

  socket.on('stop-typing', ({ roomId }) => {
    socket.to(roomId).emit('stop-typing', {
      roomId,
      userId: socket.userId,
      name: socket.userName,
    });
  });

  socket.on('disconnecting', async () => {
    console.log(`[Socket] ${socket.userName} disconnecting from room: ${socket.currentRoom}`);
    if (socket.currentRoom) {
      // Remove cursor state
      const cursors = roomCursorState.get(socket.currentRoom);
      if (cursors) {
        cursors.delete(socket.userId);
        if (cursors.size === 0) {
          roomCursorState.delete(socket.currentRoom);
        }
      }
      
      // Notify others that cursor is removed
      io.to(socket.currentRoom).emit('cursor-remove', {
        userId: socket.userId,
      });
      
      io.to(socket.currentRoom).emit('user-left', {
        userId: socket.userId,
        name: socket.userName,
        avatar: socket.userAvatar,
      });
      await broadcastOnlineCount(io, socket.currentRoom);
    }
  });
};

module.exports = chatHandler;
