import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Require all the apis here
import router from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Use all the routes here
app.use("/api/auth", router);

export { app };
