const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    dateTime: { type: Date, required: true },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Reject"],
      default: "Pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appointment", appointmentSchema);
