import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import adminRoute from './routes/admin.js';
import alumniRoute from './routes/alumni.js';
import mentorsRoute from './routes/mentors.js';
import galleryRoutes from "./routes/gallery.js";
import sponsorRoutes from "./routes/sponsorRoutes.js";
import allRoutes from "./routes/index.js";

import { getAlumniContributions } from './controllers/alumniContributionController.js';

const app = express();

app.use(
  cors({
    origin: 'https://alumnicell.iiti.ac.in',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => res.send('Hello Server'));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/alumni', alumniRoute);
app.use('/api/mentors', mentorsRoute);
app.use("/api", allRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/uploads", express.static("uploads"));

app.get('/api/alumni-contributions', getAlumniContributions);

const mongodbLink = process.env.MONGO_URI || process.env.MONGODB_LINK;

if (!mongodbLink) {
  console.error("? MONGO_URI is not defined in environment variables!");
  process.exit(1);
}

console.log('Mongo URI:', mongodbLink);

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbLink, {
      serverSelectionTimeoutMS: 30000,   // 30 seconds
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    });

    console.log('Connected to MongoDB successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Do not exit in production if you want PM2 to restart automatically
    // process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 3008;
  app.listen(PORT, () => {
    console.log(`?? Server started at PORT ${PORT}`);
  });
};

startServer();

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});