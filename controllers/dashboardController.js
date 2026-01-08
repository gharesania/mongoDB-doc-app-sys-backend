const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Appointment = require("../models/appointmentModel");

async function getAdminDashboard(req, res) {
  try {
    const totalUsers = await User.countDocuments();

    const totalDoctors = await Doctor.countDocuments({
      status: "Accept",
    });

    // const totalAppointments = await Appointment.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        // totalAppointments,
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to load admin dashboard",
    });
  }
}

async function doctorDashboard(req, res) {
  try {
    const doctorId = req.user.id;

    // total appointments for this doctor
    const totalAppointments = await Appointment.countDocuments({
      doctorId,
    });

    // total unique patients
    const patients = await Appointment.distinct("userId", {
      doctorId,
    });

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        totalPatients: patients.length,
      },
    });
  } catch (error) {
    console.error("doctorDashboard:", error);
    res.status(500).json({
      success: false,
      msg: "Server Error",
    });
  }
}

async function userDashboard(req, res) {
  try {
    const userId = req.user.id;

    const totalAppointments = await Appointment.countDocuments({
      userId,
    });

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server Error" });
  }
}

module.exports = {
  userDashboard,
  doctorDashboard,
  getAdminDashboard,
};