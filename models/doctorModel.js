const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, 
      ref: "user" },
    specialist: { type: String, required: true },
    fees: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Accepted", "Rejected", "Pending"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("doctor", doctorSchema);
