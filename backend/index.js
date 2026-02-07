import express from 'express'
import { configDotenv } from 'dotenv'
import { connectDB } from './lib/db.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.routes.js';
import bookRoute from './routes/book.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

configDotenv();

const app = express();

// 1. Define base allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "http://localhost:3000"  // React dev
];

// 2. Add detailed logging and sanitization for FRONTEND_URL
if (process.env.FRONTEND_URL) {
  // CRITICAL: Trim whitespace/newlines to prevent "Invalid character in header" error
  const cleanUrl = process.env.FRONTEND_URL.trim().replace(/\/$/, ""); // Remove trailing slash
  try {
    const url = new URL(cleanUrl);
    allowedOrigins.push(url.origin);
    console.log("Allowed Origin from Env:", url.origin);
  } catch (e) {
    console.warn("Invalid FRONTEND_URL in .env:", process.env.FRONTEND_URL);
  }
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is allowed or is a Vercel preview
    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully" });
});



app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
  connectDB();
})