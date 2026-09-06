const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

const { loginUser, registerUser, getProfile } = require("../controllers/authController");
router.get("/profile", protect, getProfile);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
