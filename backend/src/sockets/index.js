const { Server } = require('socket.io');
const passport = require('../config/passport');
const env = require('../config/env');
const sessionMiddleware = require('../config/session');
const chatHandler = require('./chat.handler');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    const user = socket.request.user;
    if (user) {
      socket.userId = user.id;
      socket.userName = user.name;
      socket.userAvatar = user.avatar || '';
      console.log(`[Socket Auth] Authenticated: ${user.name} (${user.id})`);
      return next();
    }
    console.log('[Socket Auth] Authentication failed - no user in session');
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
