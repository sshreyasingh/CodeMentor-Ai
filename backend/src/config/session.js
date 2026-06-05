const session = require('express-session');
const MongoStore = require('connect-mongo');
const env = require('./env');

const isProd = env.nodeEnv === 'production';

const sessionMiddleware = session({
  name: 'codementor.sid',
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: env.mongodbUri,
    ttl: 7 * 24 * 60 * 60,
  }),
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
});

module.exports = sessionMiddleware;
