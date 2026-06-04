import { createContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Connected with ID:', newSocket.id);
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    newSocket.on('error', (error) => {
      console.error('[Socket] Error:', error);
    });

    setSocket(newSocket);

    return () => {
      console.log('[Socket] Cleaning up connection');
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
