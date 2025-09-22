import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const corsOption = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"], //or "*"
  credentials: true,
};
// Attach Socket.Io to HTTP server
const io = new Server(server, {
  cors: corsOption,
});

const userSocketMap = {}; //this map stores socket id corresponding the user id; userId -> socketId ; eg {user._id : socket.id} :)

// ___________________________(here function implementation to get socketId by userId) _____________________________
// ✅ Utility function
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
// Socket.IO connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId; //
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`user connected: UserId: ${userId}, SocketId = ${socket.id}`);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //
  // disconnection----------------------------------------------------------------------------
  socket.on("disconnect", () => {
    if (userId) {
      console.log(
        `user disconnected: UserId: ${userId}, SocketId = ${socket.id}`
      );
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //
  });
  // disconnection----------------------------------------------------------------------------
});

export { app, server, io };
