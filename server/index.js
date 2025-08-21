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
// Optional: if you have other grouped routes
import allRoutes from "./routes/index.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
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
app.use('/auth', authRoutes);
app.use('/admin', adminRoute);
app.use('/alumni', alumniRoute); // have to shift add,get and delete mentors from here to admin route
app.use('/mentors', mentorsRoute);
app.use("/", allRoutes);

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
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
