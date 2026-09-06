const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
  markMessagesSeen,
} = require("../controllers/messageController");

router.post("/", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);
router.post("/:conversationId/seen", protect, markMessagesSeen);
module.exports = router;
