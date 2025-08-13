require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./models/HoldingsModels");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");
const UserModel = require("./models/UserModel"); 

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "https://zerodhaclone-frontend-4.onrender.com"],
  credentials: true,
}));

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Routes
app.get("/allHoldings", async (req, res) => {
  const allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  const allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json({ success: false, message: "Please fill all fields" });
    }

    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const newUser = new UserModel({ username, email, password });
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1d" });

    // Send token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      sameSite: "None", // required for cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ success: true, message: "Signup successful", user: { username, email } });
  } catch (error) {
    console.error("Signup error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

// Auth check
app.get("/check", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ success: false, message: "No token found" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Auth check error:", error);
    res.json({ success: false, message: "Invalid token" });
  }
});

// Start server & connect to DB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("DB connected!");
    app.listen(PORT, () => console.log("App started on port", PORT));
  })
  .catch(err => console.error("DB connection error:", err));
