// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is missing. Check your ROOT .env + dotenv path in server.js');
    }

    const conn = await mongoose.connect(uri);

    console.log(
      `MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`
    );
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
