import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

try {
  await connectDB();
} catch (err) {
  console.error("Failed to connect to the database", err);
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }
));
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js"
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`);
  console.log(`Server started at: ${new Date().toLocaleString()}`);
});
