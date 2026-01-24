import mongoose from "mongoose";

export const connectDB = async() => {
  try {
    const mongoUri = process.env.mongoURI;
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`DB not connected: ${error}`);
  }
}