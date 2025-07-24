import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.js";
import adminRoute from './routes/admin.route.js'
import alumniRoute from './routes/alumni.route.js'
import cv_reviewRoute from './routes/cv_review.js'
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    return res.send("Hello Server");
})
app.use("/auth", authRoutes);
app.use("/admin",adminRoute);
app.use("/alumni",alumniRoute);
app.use("/cv",cv_reviewRoute);

const PORT = process.env.PORT | 8000;
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
