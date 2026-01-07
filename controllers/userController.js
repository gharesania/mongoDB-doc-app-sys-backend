const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

BASE_URL = process.env.BASE_URL;

// Register User
const register = async (req, res) => {
  try {
    console.log(req.body);
    let { name, email, password, contactNumber, address, gender } = req.body;

    const imagePath = req.file ? req.file.filename : null;

    //Basic Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ msg: "Name, Email & Password are required!", success: false });
    }

    // Password strength check
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    // Check existing User
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res
        .status(409)
        .send({ msg: "User already exists", success: false });
    } else {
      // Hash Password
      console.log("Password before hashing: ", password);
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(String(password), salt);
      console.log("Password after hashing: ", password);

      //Save user
      newUser = await User.create({
        name,
        email,
        password,
        contactNumber,
        address,
        gender,
        imagePath,
      });

      await newUser.save();

      return res.status(200).send({ msg: "User registered !", success: false });
    }
  } catch (error) {
    console.error("Register Error: ", error);
    return res.status(500).send({ msg: "Internal Server Error ❌" });
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body);
    let { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    //Find User
    const loggedUser = await User.findOne({ email: email });
    console.log("Logged User", loggedUser);

    if (!loggedUser) {
      return res.status(404).send({ msg: "User not found 👎🏻", success: false });
    }

    // Compare password
    const isMatch = await bcrypt.compare(String(password), loggedUser.password);

    if (isMatch) {
      const payload = { id: loggedUser._id, role: loggedUser.role };

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      });

      return res
        .status(202)
        .send({ msg: "Log in successfull !", success: true, token: token });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("Login Error: ", error);
    return res.status(500).send({ msg: "Internal Server Error ❌" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    console.log(req.user, "In controller");

    const loggedUser = await User.findById(req.user.id).select("-password");

    loggedUser.imagePath = process.env.BASE_URL + loggedUser.imagePath;

    console.log("Logged User", loggedUser);

    return res.status(200).send({ user: loggedUser, success: true });
  } catch (error) {
    console.error("User Info Error: ", error);
    return res.status(500).send({ msg: "Internal Server Error ❌" });
  }
};

module.exports = { register, login, getUserInfo };
