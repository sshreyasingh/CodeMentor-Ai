const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const env = require('./config/env');
const sessionMiddleware = require('./config/session');
const { initializeSocket } = require('./sockets');

const app = express();
const server = http.createServer(app);

// Graceful shutdown handler
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

app.set('trust proxy', 1);

// Session
app.use(sessionMiddleware);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Security
app.use(
  helmet({
    contentSecurityPolicy: env.nodeEnv === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// Rate limiting
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.nodeEnv !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/rooms', require('./routes/room.routes'));
app.use('/api/v1/review', require('./routes/review.routes'));
app.use('/api/v1/ai', require('./routes/ai.routes'));
app.use('/api/v1/insights', require('./routes/insight.routes'));
app.use('/api/v1/sessions', require('./routes/session.routes'));
app.use('/api/v1/chat', require('./routes/chat.routes'));
app.use('/api/v1/analytics', require('./routes/analytics.routes'));
app.use('/api/v1/execute', require('./routes/execution.routes'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 404 — only for /api routes, returns JSON
app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// In production, serve the frontend build
if (env.nodeEnv === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  } else {
    console.warn(`Frontend build not found at ${frontendDist}. Run "npm run build" first.`);
    app.get('*', (_req, res) => {
      res.status(404).json({ message: 'Frontend not built. Run npm run build.' });
    });
  }
} else {
  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

// Global error handler
app.use(require('./middleware/error.middleware'));

const start = async () => {
  if (!env.mongodbUri) {
    console.error('MONGODB_URI is required.');
    process.exit(1);
  }
  if (!env.sessionSecret) {
    console.error('SESSION_SECRET is required.');
    process.exit(1);
  }
  await connectDB(env.mongodbUri);
  initializeSocket(server);
  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
  });
};

start();

module.exports = { app, server };
