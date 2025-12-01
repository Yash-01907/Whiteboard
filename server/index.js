import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// 1. IMPORT THESE for Socket.io
import { createServer } from "http";
import { Server } from "socket.io";

try {
  await connectDB();
} catch (err) {
  console.error("Failed to connect to the database", err);
  process.exit(1);
}

const app = express();

// 2. CREATE HTTP SERVER
// We wrap the Express app so both Express AND Socket.io can run on the same port
const httpServer = createServer(app);

// 3. INITIALIZE SOCKET.IO
const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL, // e.g. http://localhost:5173
    credentials: true,                // Important for cookies
  },
});

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser()); // <--- KEEP THIS! It handles your REST API cookies
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// --- ROUTES ---
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import whiteboardRoutes from "./routes/whiteboard.route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/whiteboards", whiteboardRoutes);

// --- SOCKET LOGIC ---
io.on("connection", (socket) => {
  console.log("🔌 New Client Connected:", socket.id);

  // A. Join Room (User enters a specific board)
  socket.on("join_room", (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined room: ${boardId}`);
  });

  // B. Handle Drawing (Broadcast to room)
  socket.on("draw_stroke", (data) => {
    const { boardId, shape } = data;
    // Broadcast to everyone in the room EXCEPT the sender
    socket.to(boardId).emit("receive_stroke", shape);
  });

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected", socket.id);
  });
});

// 4. LISTEN (CHANGE THIS!)
// Do NOT use app.listen(). Use httpServer.listen()
httpServer.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`);
  console.log(`Server started at: ${new Date().toLocaleString()}`);
});