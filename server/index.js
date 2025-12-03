import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import { createServer } from "http";
import { Server } from "socket.io";

try {
  await connectDB();
} catch (err) {
  console.error("Failed to connect to the database", err);
  process.exit(1);
}

const app = express();

const httpServer = createServer(app);

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
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

  socket.on("join_room", (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined room: ${boardId}`);
  });
  
  socket.on("draw_stroke", (data) => {
    const { boardId, shape } = data;
    socket.to(boardId).emit("receive_stroke", shape);
  });

  socket.on("drawing_move", (data) => {
    const { boardId, shape } = data;
    socket.to(boardId).emit("drawing_move", shape);
  });
  
  socket.on("cursor_move",(data)=>{
      const {boardId,userId,username,x,y}=data;
      socket.to(boardId).emit("cursor_move",{userId,username,x,y})
  })

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected", socket.id);
  });
});


httpServer.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`);
  console.log(`Server started at: ${new Date().toLocaleString()}`);
});