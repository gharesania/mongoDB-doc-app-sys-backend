const Appointment = require("../models/appointmentModel");

/* ================= CREATE APPOINTMENT ================= */
async function createAppointment(req, res) {
  try {
    const { dateTime, doctorId } = req.body;
    const userID = req.user.id;

    if (!dateTime || !doctorId) {
      return res.status(400).json({
        success: false,
        msg: "Date and doctor are required",
      });
    }

    const appointment = await Appointment.create({
      userID, // ✅ matches schema
      doctorId,
      dateTime: new Date(dateTime), // ✅ matches schema
      createdBy: userID,
    });

    res.status(201).json({
      success: true,
      msg: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("createAppointment:", error);
    res.status(500).json({ msg: "Server Error" });
  }
}

/* ================= USER APPOINTMENTS ================= */
async function getAppointmentsByUser(req, res) {
  try {
    const appointments = await Appointment.find({
      userID: req.user.id, // ✅ MUST match schema
    })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("getAppointmentsByUser:", error);
    res.status(500).json({ msg: "Server Error" });
  }
}

/* ================= DOCTOR UPDATE STATUS ================= */
async function statusUpdateByDoctor(req, res) {
  try {
    const { ID } = req.params;
    const { status } = req.body;

    if (!["Accepted", "Reject", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid status",
      });
    }

    const appointment = await Appointment.findById(ID);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "Appointment not found",
      });
    }

    // only assigned doctor can update
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    appointment.status = status;
    appointment.updatedBy = req.user.id;
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: "Appointment status updated successfully",
    });
  } catch (error) {
    console.error("statusUpdateByDoctor:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
}

/* ================= UPDATE APPOINTMENT (USER) ================= */
async function updateAppointment(req, res) {
  try {
    const { ID } = req.params;
    const { dateTime, doctorId } = req.body;

    if (!dateTime || !doctorId) {
      return res.status(400).json({
        success: false,
        msg: "Date and doctor are required",
      });
    }

    const appointment = await Appointment.findById(ID);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "Appointment not found",
      });
    }

    // only creator can update
    if (appointment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    appointment.dateTime = new Date(dateTime);
    appointment.doctorId = doctorId;
    appointment.updatedBy = req.user.id;
    // console.log("Before save:", appointment.dateTime);

    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: "Appointment updated successfully",
      appointment,
    });
  } catch (error) {
    console.error("Update Appointment Error:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
}

/* ================= DELETE APPOINTMENT ================= */
async function deleteAppointment(req, res) {
  try {
    const { ID } = req.params;

    const appointment = await Appointment.findById(ID);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "Appointment not found",
      });
    }

    // only creator can delete
    if (appointment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    await Appointment.findByIdAndDelete(ID);

    return res.status(200).json({
      success: true,
      msg: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("deleteAppointment:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
}

/* ================= DOCTOR APPOINTMENTS ================= */
async function showAppointmentsOfDoctor(req, res) {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user.id,
    })
      .populate("userID", "name") // ✅ populate patient
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("showAppointmentsOfDoctor:", error);
    res.status(500).json({ msg: "Server Error" });
  }
}

/* ================= All APPOINTMENTS ================= */
async function allAppointments(req, res) {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name email")
      .populate("userID", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("All Appointments Error:", error);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
}

module.exports = {
  createAppointment,
  getAppointmentsByUser,
  statusUpdateByDoctor,
  updateAppointment,
  deleteAppointment,
  showAppointmentsOfDoctor,
  allAppointments,
};
