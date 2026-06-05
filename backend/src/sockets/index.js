const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const env = require('../config/env');
const sessionMiddleware = require('../config/session');
const User = require('../models/user.model');
const chatHandler = require('./chat.handler');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use(async (socket, next) => {
    // Try Passport session first (same-origin deployment)
    const user = socket.request.user;
    if (user) {
      socket.userId = user.id;
      socket.userName = user.name;
      socket.userAvatar = user.avatar || '';
      console.log(`[Socket Auth] Session: ${user.name} (${user.id})`);
      return next();
    }

    // Try JWT token from query param (split deployments — frontend passes token)
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, env.jwtSecret);
        const dbUser = await User.findById(decoded.userId);
        if (dbUser) {
          socket.userId = dbUser.id;
          socket.userName = dbUser.name;
          socket.userAvatar = dbUser.avatar || '';
          console.log(`[Socket Auth] JWT: ${dbUser.name} (${dbUser.id})`);
          return next();
        }
      } catch (err) {
        console.error('[Socket Auth] JWT verification failed:', err.message);
      }
    }

    console.log('[Socket Auth] Failed — no session or valid JWT');
    next(new Error('Authentication required'));
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.userName} (${socket.userId}) - Socket ID: ${socket.id}`);

    chatHandler(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${socket.userName} (${socket.userId}) - Reason: ${reason}`);
    });

    socket.on('error', (error) => {
      console.error(`[Socket] Error for ${socket.userName}:`, error);
    });
  });

  return io;
};

module.exports = { initializeSocket };
