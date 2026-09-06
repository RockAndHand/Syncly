const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
} = require("../controllers/friendRequestController");

router.post("/", protect, sendRequest);
router.get("/", protect, getRequests);
router.post("/:id/accept", protect, acceptRequest);
router.post("/:id/reject", protect, rejectRequest);
module.exports = router;
