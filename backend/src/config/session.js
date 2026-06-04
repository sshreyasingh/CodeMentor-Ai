const session = require('express-session');
const MongoStore = require('connect-mongo');
const env = require('./env');

const sessionMiddleware = session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: env.mongodbUri }),
  cookie: {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
});

module.exports = sessionMiddleware;
