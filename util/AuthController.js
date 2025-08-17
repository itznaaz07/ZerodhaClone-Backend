const bcrypt = require("bcryptjs");
const User = require("../models/UserModel.js");
const { createSecretToken } = require("./SecretToken.js");

//signup
module.exports.SignUp = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(202).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // create JWT token
    const token = createSecretToken(user._id);

    // set cookie
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res
      .status(201)
      .json({ message: "User signed up successfully", success: true, user });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
module.exports.LogIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(202).json({ message: "Incorrect email or password" });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(202).json({ message: "Incorrect email or password" });
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res
      .status(201)
      .json({ message: "User logged in successfully", success: true, user });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
