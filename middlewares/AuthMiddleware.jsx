const User = require("../models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "No token found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
      if (err) {
        return res.json({ status: false, message: "Token verification failed" });
      }

      const user = await User.findById(data.id);
      if (!user) {
        return res.json({ status: false, message: "User not found" });
      }

      return res.json({ status: true, user: user.username });
    });

  } catch (error) {
    console.error("Verification error:", error);
    return res.json({ status: false, message: "Server error" });
  }
};
