import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && uri !== 'mongodb://localhost:27017/lifelink') {
      // Direct Atlas or custom URI
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB] Successfully connected to Database: ${mongoose.connection.host}`);
      return;
    }

    // Try local mongod first
    try {
      await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/lifelink', {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(`[MongoDB] Connected to local MongoDB instance: ${mongoose.connection.host}`);
      return;
    } catch (localErr) {
      console.log(`[MongoDB] Local MongoDB server not found. Initializing built-in in-memory database engine...`);
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const inMemoryUri = memoryServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] In-memory MongoDB initialized successfully at: ${inMemoryUri}`);
    }
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
