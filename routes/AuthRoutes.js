const express = require("express");
const router = express.Router();
const { Signup, Login } = require("../controllers/AuthController.jsx"); // ✅ no .jsx
const { userVerification } = require("../middlewares/AuthMiddleware.jsx"); // ✅ no .jsx

// Signup & Login
router.post("/signup", Signup);
router.post("/login", Login);

// Auth check
router.get("/check", userVerification, (req, res) => {
  res.json({ success: true, user: req.user.username });
});

// Logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
