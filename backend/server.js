import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth-route/auth.routes.js";
import userRoutes from "./routes/user-route/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000" })); 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});