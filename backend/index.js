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

app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow configuration or fallback to all
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