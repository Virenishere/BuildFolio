import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConnection";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { logger } from "./utils/logger";
import authRoutes from "./routes/authRoutes";
import gptRoutes from "./routes/gptRoutes";
import profileRoutes from "./routes/profileRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import aiRoutes from "./ai/ai.routes";

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

connectDB();

const allowedOrigins = [
  "https://build-folio.vercel.app",
  "http://localhost:8000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(apiRateLimiter);

// ── Request logging ────────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip ?? "",
    userAgent: req.get("user-agent") ?? "",
  });
  next();
});

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/gpt", gptRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai", aiRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use(errorMiddleware);

app.listen(port, () => {
  logger.info(`Server running at http://localhost:${port}`);
});
