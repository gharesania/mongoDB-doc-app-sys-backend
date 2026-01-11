const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL;

const register = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    console.log("req.file.filename:", req.file?.filename);
    console.log("req.file.path:", req.file?.path);

    const { name, email, password, contactNumber, address, gender } = req.body;

    const imagePath = req.file
      ? `${process.env.BASE_URL}uploads/${req.file.filename}`
      : null;

    // Basic Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ msg: "Name, Email & Password are required!", success: false });
    }

    if (password.length < 6) {
      return res.status(400).json({
        msg: "Password must be at least 6 characters long",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .send({ msg: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      address,
      gender,
      imagePath,
    });

    await newUser.save();
    res.status(200).send({ msg: "User registered!", success: true });
  } catch (error) {
    console.error("Register Error:", error);
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

    console.log("Logged User", loggedUser);

    res.status(200).send({ user: loggedUser, success: true });
  } catch (error) {
    console.error("User Info Error: ", error);
    return res.status(500).send({ msg: "Internal Server Error ❌" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, contactNumber, address, gender } = req.body;

    // Find existing user FIRST (to get old image)
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (contactNumber) updateData.contactNumber = contactNumber;
    if (address) updateData.address = address;
    if (gender) updateData.gender = gender;

    // If new image uploaded
    if (req.file) {
      // 🔴 DELETE OLD IMAGE (if exists)
      if (existingUser.imagePath) {
        const oldImageName = path.basename(existingUser.imagePath);
        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          oldImageName
        );

        // Delete file safely
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.warn("Old image delete failed:", err.message);
          }
        });
      }

      // Save new image path
      updateData.imagePath = `${process.env.BASE_URL}uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to update profile",
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "Accepted" }).populate(
      "userId",
      "name email contactNumber gender"
    );

    res.status(200).json({
      success: true,
      doctors: doctors.map((doc) => ({
        _id: doc._id,
        name: doc.userId.name,
        email: doc.userId.email,
        contactNumber: doc.userId.contactNumber,
        gender: doc.userId.gender,
        specialist: doc.specialist,
        fees: doc.fees,
      })),
    });
  } catch (error) {
    console.error("getAllDoctors:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        email: 1,
        gender: 1,
        contactNumber: 1,
        role: 1,
      }
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("getAllUsers:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  updateProfile,
  getAllDoctors,
  getAllUsers,  
};
