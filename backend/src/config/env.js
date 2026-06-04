const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  sessionSecret: process.env.SESSION_SECRET || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
  groqApiKey: process.env.GROQ_API_KEY || '',
  jdoodleClientId: process.env.JDOODLE_CLIENT_ID || '',
  jdoodleClientSecret: process.env.JDOODLE_CLIENT_SECRET || '',
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || '',
  },
};
