const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.static("public"));

const rooms = {};

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  // Join Room
  socket.on("join-room", ({ roomId, user }) => {

    socket.join(roomId);

    socket.roomId = roomId;
    socket.user = user;

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId].push({
      id: socket.id,
      user
    });

    io.to(roomId).emit("room-users", rooms[roomId]);

    socket.to(roomId).emit("user-joined", {
      id: socket.id,
      user
    });

  });

  // Voice Signaling (WebRTC)
  socket.on("signal", (data) => {

    io.to(data.to).emit("signal", {
      from: socket.id,
      signal: data.signal
    });

  });

  // Chat
  socket.on("chat-message", (msg) => {

    if (!socket.roomId) return;

    io.to(socket.roomId).emit("chat-message", {
      user: socket.user,
      message: msg,
      time: Date.now()
    });

  });

  // Gift
  socket.on("send-gift", (gift) => {

    if (!socket.roomId) return;

    io.to(socket.roomId).emit("gift-animation", gift);

  });

  // Mute
  socket.on("mute-user", (targetId) => {

    io.to(targetId).emit("muted");

  });

  // Kick
  socket.on("kick-user", (targetId) => {

    io.to(targetId).emit("kicked");

  });

  socket.on("disconnect", () => {

    let roomId = socket.roomId;

    if (roomId && rooms[roomId]) {

      rooms[roomId] = rooms[roomId].filter(
        u => u.id !== socket.id
      );

      io.to(roomId).emit("room-users", rooms[roomId]);

      socket.to(roomId).emit("user-left", socket.id);

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }

    console.log("Disconnected:", socket.id);

  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`MF Voice Party Server Running on ${PORT}`);
});
