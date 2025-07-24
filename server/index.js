import "dotenv/config";
import cookieParser from 'cookie-parser';
import express from "express";
import mongoose from "mongoose";
import allRoutes from "./routes/index.js";

import cors from "cors"
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/", allRoutes);

const mongodbLink = process.env.MONGODB_LINK;

mongoose
  .connect(mongodbLink)
  .then(() => {
    console.log("Connected to MongoDB successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));