import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import adminRoute from "./routes/admin.route.js";
import alumniRoute from "./routes/alumni.route.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  return res.send("Hello Server");
});
app.use("/auth", authRoutes);
app.use("/api", adminRoute);
app.use("/alumni", alumniRoute);

console.log("MONGO_URI is:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error", err));
const PORT = process.env.PORT | 8000;
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
