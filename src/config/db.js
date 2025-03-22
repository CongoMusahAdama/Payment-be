import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI); 
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;
