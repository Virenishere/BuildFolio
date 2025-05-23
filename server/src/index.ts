import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConnection";
import authRoutes from "./routes/authRoutes";
import gptRoutes from "./routes/gptRoutes";
import profileRoutes from "./routes/profileRoutes";
import resumeRoutes from "./routes/resumeRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
connectDB();

const allowedOrigins = [
  "https://build-folio.vercel.app/",
  "http://localhost:8000",
  "http://localhost:5173", 
];


// Middleware
// Enable CORS with dynamic origin
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman or curl) test
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

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gpt", gptRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get('/', (req, res) => {
  res.send("API is running");
});

// Error handling middleware (should be added after all routes)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});