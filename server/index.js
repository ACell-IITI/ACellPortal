import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import authRoutes from './routes/auth.js';
import adminRoute from './routes/admin.js';
import alumniRoute from './routes/alumni.js';
import mentorsRoute from './routes/mentors.js';
import galleryRoutes from "./routes/gallery.js"
import sponsorRoutes from "./routes/sponsorRoutes.js";
// Optional: if you have other grouped routes
import allRoutes from "./routes/index.js";
import { getAlumniContributions } from './controllers/alumniContributionController.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: ['https://alumnicell.iiti.ac.in', 'http://localhost:5000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  return res.send('Hello Server');
});

// Use individual routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/alumni', alumniRoute);
app.use('/api/mentors', mentorsRoute);
app.use("/api", allRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/sponsors", sponsorRoutes);

// Public routes
app.get('/api/alumni-contributions', getAlumniContributions);

// MongoDB connection
const mongodbLink = process.env.MONGO_URI || process.env.MONGODB_LINK;
console.log('Mongo URI:', mongodbLink);

mongoose
  .connect(mongodbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch((err) => console.error('MongoDB connection error', err));

// Start server
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
