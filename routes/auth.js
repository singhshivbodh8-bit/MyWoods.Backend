const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controller/authController");
const { protect } = require("../middleware/auth");

// Public routes — anyone can call these
router.post("/register", register); // POST /api/auth/register
router.post("/login", login); // POST /api/auth/login

// Protected route — needs a valid token (added by the `protect` middleware)
router.get("/me", protect, getMe); // GET  /api/auth/me

module.exports = router;