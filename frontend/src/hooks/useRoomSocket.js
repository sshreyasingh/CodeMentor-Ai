import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useSocket } from './useSocket';
import { CodeContext } from '../context/CodeContext';

const useRoomSocket = (roomId) => {
  const [participants, setParticipants] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [systemMessages, setSystemMessages] = useState([]);
  const [lastEditor, setLastEditor] = useState(null);
  const [myColor, setMyColor] = useState(null);
  const [remoteCursors, setRemoteCursors] = useState({});
  const { socket } = useSocket();
  const { setCode, setLanguage } = useContext(CodeContext);
  
  // Use a ref that tracks the CURRENT room ID to handle room switches
  const currentRoomRef = useRef(null);
  const isRemoteUpdateRef = useRef(false);

  // Reset state when room changes
  useEffect(() => {
    console.log('[useRoomSocket] Room changed to:', roomId);
    currentRoomRef.current = roomId;
    setParticipants([]);
    setSystemMessages([]);
    setLastEditor(null);
    setOnlineCount(0);
    setMyColor(null);
    setRemoteCursors({});
  }, [roomId]);

  // Main socket event handlers
  useEffect(() => {
    if (!socket || !roomId) {
      console.log('[useRoomSocket] Waiting for socket or roomId...', { hasSocket: !!socket, roomId });
      return;
    }

    console.log('[useRoomSocket] Setting up socket listeners for room:', roomId);

    // Join the room
    console.log('[useRoomSocket] Emitting join-room for:', roomId);
    socket.emit('join-room', { roomId });

    // Handler for when we successfully join
    const handleJoinedRoom = ({ participants: roomParticipants, code: roomCode, language: roomLanguage, cursorPositions, myColor: color }) => {
      console.log('[useRoomSocket] Joined room successfully, received code length:', roomCode?.length);
      setParticipants(roomParticipants || []);
      setMyColor(color);
      
      // Initialize remote cursors
      if (cursorPositions && cursorPositions.length > 0) {
        const cursors = {};
        cursorPositions.forEach(cursor => {
          if (cursor.userId !== socket.userId) {
            cursors[cursor.userId] = cursor;
          }
        });
        setRemoteCursors(cursors);
      }
      
      if (roomCode !== undefined) {
        console.log('[useRoomSocket] Setting code from joined-room event');
        isRemoteUpdateRef.current = true;
        setCode(roomCode);
        setTimeout(() => { isRemoteUpdateRef.current = false; }, 100);
      }
      
      if (roomLanguage) {
        setLanguage(roomLanguage);
      }
    };

    // Handler for code updates from other users
    const handleCodeUpdate = ({ code: newCode, name }) => {
      console.log('[useRoomSocket] Received code update from:', name);
      if (!newCode) return;
      
      isRemoteUpdateRef.current = true;
      setCode(newCode);
      setLastEditor(name);
      setTimeout(() => { isRemoteUpdateRef.current = false; }, 100);
    };

    // Handler for language updates
    const handleLanguageUpdate = ({ language: newLanguage }) => {
      console.log('[useRoomSocket] Received language update:', newLanguage);
      setLanguage(newLanguage);
    };

    // Handler for user joined
    const handleUserJoined = ({ userId, name, avatar, color }) => {
      console.log('[useRoomSocket] User joined:', name);
      setParticipants((prev) => {
        if (prev.some((p) => p.userId === userId)) return prev;
        return [...prev, { userId, name, avatar, color }];
      });
      setSystemMessages((prev) => [
        ...prev,
        { _id: `join-${userId}-${Date.now()}`, type: 'system', sender: { name }, text: `${name} joined the room` },
      ]);
    };

    // Handler for user left
    const handleUserLeft = ({ userId, name }) => {
      console.log('[useRoomSocket] User left:', name);
      setParticipants((prev) => prev.filter((p) => p.userId !== userId));
      
      // Remove their cursor
      setRemoteCursors((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      
      setSystemMessages((prev) => [
        ...prev,
        { _id: `leave-${userId}-${Date.now()}`, type: 'leave', sender: { name }, text: `${name} left the room` },
      ]);
    };

    // Handler for online count
    const handleOnlineCount = ({ count }) => {
      setOnlineCount(count);
    };

    // Handler for cursor updates from other users
    const handleCursorUpdate = ({ userId, name, color, position, selection }) => {
      setRemoteCursors((prev) => ({
        ...prev,
        [userId]: { userId, name, color, position, selection, timestamp: Date.now() },
      }));
    };

    // Handler for cursor selection updates
    const handleCursorSelectionUpdate = ({ userId, selection }) => {
      setRemoteCursors((prev) => {
        if (!prev[userId]) return prev;
        return {
          ...prev,
          [userId]: { ...prev[userId], selection, timestamp: Date.now() },
        };
      });
    };

    // Handler for cursor removal (user left or disconnected)
    const handleCursorRemove = ({ userId }) => {
      setRemoteCursors((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    };

    // Register all event listeners
    socket.on('joined-room', handleJoinedRoom);
    socket.on('code-update', handleCodeUpdate);
    socket.on('language-update', handleLanguageUpdate);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('online-count', handleOnlineCount);
    socket.on('cursor-update', handleCursorUpdate);
    socket.on('cursor-selection-update', handleCursorSelectionUpdate);
    socket.on('cursor-remove', handleCursorRemove);

    // Cleanup
    return () => {
      console.log('[useRoomSocket] Cleaning up, leaving room:', roomId);
      socket.emit('leave-room', { roomId });
      socket.off('joined-room', handleJoinedRoom);
      socket.off('code-update', handleCodeUpdate);
      socket.off('language-update', handleLanguageUpdate);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('online-count', handleOnlineCount);
      socket.off('cursor-update', handleCursorUpdate);
      socket.off('cursor-selection-update', handleCursorSelectionUpdate);
      socket.off('cursor-remove', handleCursorRemove);
    };
  }, [socket, roomId, setCode, setLanguage]);

  // Function to emit code changes - use useCallback for stability
  const emitCodeChange = useCallback((newCode) => {
    if (!socket || isRemoteUpdateRef.current) {
      console.log('[useRoomSocket] Not emitting - no socket or remote update');
      return;
    }
    console.log('[useRoomSocket] Emitting code-change to room:', roomId);
    socket.emit('code-change', { roomId, code: newCode });
  }, [socket, roomId]);

  // Function to emit language changes
  const emitLanguageChange = useCallback((newLanguage) => {
    if (!socket) return;
    console.log('[useRoomSocket] Emitting language-change:', newLanguage);
    socket.emit('language-change', { roomId, language: newLanguage });
  }, [socket, roomId]);

  // Function to emit cursor movement
  const emitCursorMove = useCallback((position, selection) => {
    if (!socket) return;
    socket.emit('cursor-move', { roomId, position, selection });
  }, [socket, roomId]);

  // Function to emit cursor selection
  const emitCursorSelection = useCallback((selection) => {
    if (!socket) return;
    socket.emit('cursor-selection', { roomId, selection });
  }, [socket, roomId]);

  return { 
    participants, 
    onlineCount, 
    systemMessages, 
    lastEditor,
    myColor,
    remoteCursors,
    emitCodeChange,
    emitLanguageChange,
    emitCursorMove,
    emitCursorSelection,
    isRemoteUpdate: () => isRemoteUpdateRef.current
  };
};

export default useRoomSocket;
