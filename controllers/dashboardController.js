const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");

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

module.exports = {getAdminDashboard}