import { config } from "dotenv";
import { connectDB } from "./db/database.js";
import { app } from "./app.js";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import User from './model/user.js';

config({
  path: "./db/.env",
});

// CORS middleware configuration
const corsOptions = {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

io.on('connection', (socket) => {
  console.log('A user is connected');

  socket.on('updateStatus', async (userId, status) => {
    try {
      await User.findByIdAndUpdate(userId, { status });
      io.emit('statusUpdate', { userId, status }); // Emit as an object
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('typing', (userId) => {
    socket.broadcast.emit('typing', userId);
  });

  socket.on('stopTyping', (userId) => {
    socket.broadcast.emit('stopTyping', userId); // Emit 'stopTyping' event
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Optionally update the user's status to 'offline'
  });

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });
});

connectDB();
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
