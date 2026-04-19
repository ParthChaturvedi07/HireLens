import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import interviewRouter from "./routes/interview.routes.js";

const app = express();

// ===== CORS CONFIG =====
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS globally (this already handles preflight requests)
app.use(cors(corsOptions));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cookieParser());

// ===== ROUTES =====
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// ===== HEALTH CHECK (IMPORTANT FOR RENDER) =====
app.get("/", (req, res) => {
  res.send("API is running...");
});

export { app };
