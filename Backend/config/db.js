import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => console.log(`MongoDB Connected: ${conn.connection.host}`))
    .catch((error) => {
      console.error("MongoDB Connection Failed:", error.message);
      process.exit(1);
    });
};

export default connectDB;
