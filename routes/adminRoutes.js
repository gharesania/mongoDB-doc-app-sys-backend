const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { auth, admin } = require("../middleware/auth.js");

router.get("/doctorsList", auth, admin, adminController.getAllDoctors)

module.exports = router;