import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import adminRoute from "./routes/admin.route.js";
import alumniRoute from "./routes/alumni.route.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Routes
app.get("/", (req, res) => {
  return res.send("Hello Server");
});

app.use("/auth", authRoutes);
app.use("/api", adminRoute);
app.use("/alumni", alumniRoute);

// MongoDB connection
const mongodbLink = process.env.MONGO_URI || process.env.MONGODB_LINK;

console.log("MONGO_URI is:", mongodbLink);

mongoose
  .connect(mongodbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error", err));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
