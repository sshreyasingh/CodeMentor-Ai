const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`Connecting to MongoDB: ${masked}`);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
