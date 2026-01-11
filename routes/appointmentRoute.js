const express = require("express");
const appointmentController = require("../controllers/appointmentController.js");
const { auth, doctor, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/allAppointments", auth, admin,appointmentController.allAppointments);

router.post("/createAppointment", auth, appointmentController.createAppointment);

router.get("/getAppointmentsByUser", auth, appointmentController.getAppointmentsByUser);

router.patch("/statusUpdateByDoctor/:ID", auth, doctor, appointmentController.statusUpdateByDoctor);

router.put("/updateAppoint/:ID", auth, appointmentController.updateAppointment);

router.delete("/deleteAppoint/:ID", auth, appointmentController.deleteAppointment);

router.get("/showAppointmentsOfDoctor", auth, doctor, appointmentController.showAppointmentsOfDoctor);

// get appontments by query

module.exports = router;
