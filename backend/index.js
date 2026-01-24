import express from 'express'
import { configDotenv } from 'dotenv'
import { connectDB } from './lib/db.js';
import authRoute from './routes/auth.routes.js'

configDotenv();

const app = express();

app.use(express.json());
app.use("/api/auth",authRoute);



app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
  connectDB();
})