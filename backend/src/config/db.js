const mongoose = require('mongoose');

const connectDB = async (uri, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt === retries) {
        console.error('All MongoDB connection attempts failed.');
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
};

module.exports = connectDB;
