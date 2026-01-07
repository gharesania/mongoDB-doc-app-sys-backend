const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { auth, admin } = require("../middleware/auth.js");

router.post("/applyForDoctor", auth, doctorController.applyForDoctor);

router.get("/getDoctorApplications", auth, admin, doctorController.getDoctorApplications);

router.post("/docStatus/:DoctorId", auth, admin, doctorController.docStatus);

module.exports = router;
