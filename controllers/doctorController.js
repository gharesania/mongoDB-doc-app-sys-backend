const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
require("dotenv").config();

const applyDoctor = async (req, res) => {
  try {
    const { specialist, fees } = req.body;
    const userId = req.user.id;

    // Prevent duplicate apply
    const existing = await Doctor.findOne({
      userId,
      status: { $in: ["Pending", "Accepted"] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        msg: "You have already applied or are already a doctor",
      });
    }

    const newDoc = await Doctor.create({
      userId,
      specialist,
      fees,
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      msg: "Doctor applied successfully",
    });
  } catch (error) {
    console.error("applyDoctor:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

const docStatus = async (req, res) => {
  try {
    const { DoctorID } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid status value",
      });
    }

    const doctor = await Doctor.findById(DoctorID);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        msg: "Doctor not found",
      });
    }

    if (doctor.status === "Accepted") {
      return res.status(400).json({
        success: false,
        msg: "Doctor already approved",
      });
    }

    doctor.status = status;
    doctor.updatedBy = adminId;
    await doctor.save();

    // If accepted → update user role
    if (status === "Accept") {
      await User.findByIdAndUpdate(doctor.userId, {
        $set: { role: "Doctor" },
      });

      return res.status(200).json({
        success: true,
        msg: "Doctor application approved successfully",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Doctor application rejected",
    });
  } catch (error) {
    console.error("docStatus:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

async function docApplyList(req, res) {
  try {
    const doctors = await Doctor.find().populate(
      "userId",
      "name email "
    );

    res.status(200).json({
      success: true,
      doctors: doctors.map((doc) => ({
        _id: doc._id,
        specialist: doc.specialist,
        fees: doc.fees,
        status: doc.status,
        user: doc.userId, 
      })),
    });
  } catch (error) {
    console.error("docApplyList:", error);
    res.status(500).json({ msg: "Server Error" });
  }
}

module.exports = { applyDoctor, docStatus, docApplyList };
