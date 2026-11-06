import mongoose from 'mongoose';
import dns from 'node:dns';

// Ensure public DNS resolution for Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setting servers isn't supported
}

let memoryServer = null;

export const connectDB = async (retries = 3) => {
  const uri = process.env.MONGODB_URI;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (uri && uri !== 'mongodb://localhost:27017/lifelink') {
        // Direct Atlas or custom URI
        await mongoose.connect(uri, {
          tls: true,
          maxPoolSize: 10,
          minPoolSize: 1,
          serverSelectionTimeoutMS: 15000,
        });
        console.log(`[MongoDB Atlas] Successfully connected to Database: ${mongoose.connection.host}`);
        return;
      }

      // Try local mongod
      await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/lifelink', {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(`[MongoDB] Connected to local MongoDB instance: ${mongoose.connection.host}`);
      return;
    } catch (error) {
      console.warn(`[MongoDB] Connection attempt ${attempt} failed: ${error.message}`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        // If Atlas fails after all retries, fall back safely to in-memory to keep app working
        console.log(`[MongoDB] Falling back to built-in in-memory database engine...`);
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const inMemoryUri = memoryServer.getUri();
        await mongoose.connect(inMemoryUri);
        console.log(`[MongoDB] In-memory MongoDB initialized successfully at: ${inMemoryUri}`);
        return;
      }
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
