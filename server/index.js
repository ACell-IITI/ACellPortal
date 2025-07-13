import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    return res.send("Hello Server");
})
app.use("/auth", authRoutes);
// app.use("/admin");
// app.use("/alumni");

const PORT = process.env.PORT | 8000;
app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));