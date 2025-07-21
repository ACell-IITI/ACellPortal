import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import adminRoute from './routes/admin.route.js'
import alumniRoute from './routes/alumni.route.js'
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    return res.send("Hello Server");
})
const mongodbLink = process.env.MONGODB_LINK;

mongoose
  .connect(mongodbLink)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/auth", authRoutes);
app.use("/admin",adminRoute);
app.use("/alumni",alumniRoute);

const PORT = process.env.PORT | 8000;
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));