import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";

try {
  await connectDB();
} catch (err) {
  console.error("Failed to connect to the database", err);
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cookieParser());

import userRoutes from "./routes/user.route.js";
app.use("/api/v1/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`);
  console.log(`Server started at: ${new Date().toLocaleString()}`);
});
