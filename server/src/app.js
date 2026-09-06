const express = require("express");
const cors = require("cors");

const app = express();
const friendRequestRoutes = require("./routes/friendRequestRoutes");

app.use(express.json());

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello Rahul!");
});
app.use("/api/friend-requests", friendRequestRoutes);
const authRoutes = require("./routes/authRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

app.use("/api/conversations", conversationRoutes);

app.use("/api/auth", authRoutes);
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/messages", messageRoutes);
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);
module.exports = app;
