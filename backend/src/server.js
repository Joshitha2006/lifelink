import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import helpRequestRoutes from './routes/helpRequestRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import bloodDonationRoutes from './routes/bloodDonationRoutes.js';
import supportCenterRoutes from './routes/supportCenterRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { seedDatabaseIfNeeded } from './seeders/seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static folder for uploads
app.use('/uploads', express.static(path.resolve('uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'LifeLink API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', helpRequestRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/blood-donations', bloodDonationRoutes);
app.use('/api/support-centers', supportCenterRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabaseIfNeeded();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  LIFELINK API SERVER RUNNING ON PORT ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  API Health: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
