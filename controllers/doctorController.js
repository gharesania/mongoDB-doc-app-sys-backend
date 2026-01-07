const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
require("dotenv").config();

async function applyForDoctor(req, res) {
  try {
    const { specialist, fees } = req.body;
    const createdBy = req.user.id;
    const userId = req.user.id;

    console.log("*****", req.body, createdBy);

    const newDoc = await Doctor.create({ userId, specialist, fees, createdBy });
    // await newDoc.save();
    console.log(newDoc, "New Doc");

    if (newDoc) {
      res.status(200).send({
        msg: "Successfully applied for doctor position",
        success: true,
      });
    } else {
      res
        .status(200)
        .send({ msg: "Couldn't apply for doctor position", success: false });
    }
  } catch (error) {
    console.log("Doctot application error: ", error);
    res.status(500).send({ msg: "Internal Server Error !" });
  }
}

async function docStatus(req, res) {
  try {
    // const DoctorId = req.params.DoctorId;
    // console.log("Admin Id:", req.user.id, "Doctor Id:", DoctorId);
    const { DoctorId } = req.params;
    const { status } = req.body;
    const adminId = req.user.id;

    // Validate status
    if (!["Accept", "Reject"].includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid status value",
      });
    }

    // Doctor not found
    const getDoctor = await Doctor.findById(DoctorId);
    console.log(getDoctor);

    if (!getDoctor) {
      return res.status(400).send({ msg: "Doctor Not Found !", success: true });
    }

    // Prevent re-approval
    if (getDoctor.status === "Accept") {
      return res.status(400).json({
        success: false,
        msg: "Doctor already approved",
      });
    }

    // Update doctor status
    getDoctor.status = status;
    getDoctor.updatedBy = adminId;
    await getDoctor.save();

    // If approved → change user role
    if (status === "Accept") {
      await User.findByIdAndUpdate(getDoctor.userId, {
        $set: { role: "Doctor" },
      });

      return res.status(200).json({
        success: true,
        msg: "Doctor application approved successfully",
      });
    }

    // If rejected
    return res.status(200).json({
      success: true,
      msg: "Doctor application rejected",
    });
  } catch (error) {
    console.error("Doctor status update error:: ", error);
    return res.status(500).send({ msg: "Internal Server Error ❌" });
  }
}

async function getDoctorApplications(req, res) {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "name email ") // no password
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      doctors: doctors.map((doc) => ({
        _id: doc._id,
        specialist: doc.specialist,
        fees: doc.fees,
        status: doc.status,
        createdAt: doc.createdAt,
        user: doc.userId, // frontend expects `user`
      })),
    });
  } catch (error) {
    console.error("Get Doctor Applications Error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch doctor applications",
    });
  }
}

module.exports = { applyForDoctor, docStatus, getDoctorApplications};
