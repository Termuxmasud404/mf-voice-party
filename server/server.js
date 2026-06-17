const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("client"));

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // Join Room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    // notify others
    socket.to(roomId).emit("user-joined", socket.id);
  });

  // WebRTC signal relay
  socket.on("signal", (data) => {
    io.to(data.to).emit("signal", {
      from: socket.id,
      signal: data.signal
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

server.listen(3000, () => {
  console.log("Server running on 3000");
});
