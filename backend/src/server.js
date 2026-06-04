const express = require('express');
const http = require('http');
const path = require('path');
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
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (env.nodeEnv === 'development') {
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

// In production, serve the frontend build
if (env.nodeEnv === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global error handler
app.use(require('./middleware/error.middleware'));

// 404
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const start = async () => {
  if (!env.mongodbUri) {
    console.error('MONGODB_URI is required. Set it in your .env file.');
    process.exit(1);
  }
  if (!env.sessionSecret) {
    console.error('SESSION_SECRET is required. Set it in your .env file.');
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
