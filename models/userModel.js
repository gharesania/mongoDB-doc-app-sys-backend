const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String },
  address: { type: String },
  gender: { type: String,
    enum: ["Male", "Female", "Other"]
   },
  imagePath: { type: String },
  role: { type: String, 
    enum: ["User", "Admin", "Doctor"], 
    default: "User" },
},{
    timestamps: true
});


module.exports = mongoose.model("user", userSchema)