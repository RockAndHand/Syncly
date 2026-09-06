const http = require("http");

const app = require("./app");

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
app.set("io", io);
const onlineUsers = {};
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;

    io.emit("onlineUsers", Object.keys(onlineUsers));
  });

  socket.on("typing", (data) => {
    // console.log("Typing Event:", data);

    socket.broadcast.emit("userTyping", data);
  });

  socket.on("stopTyping", (data) => {
    socket.broadcast.emit("userStoppedTyping", data);
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find(
      (key) => onlineUsers[key] === socket.id,
    );

    if (userId) {
      delete onlineUsers[userId];
    }

    io.emit("onlineUsers", Object.keys(onlineUsers));

    console.log("User Disconnected:", socket.id);
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
