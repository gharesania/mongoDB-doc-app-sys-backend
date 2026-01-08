const express = require("express");
const router = express.Router();
const { auth, admin, doctor } = require("../middleware/auth.js");
const dashboardController = require("../controllers/dashboardController");

router.get("/admin", auth, admin, dashboardController.getAdminDashboard);
router.get("/doctor", auth, doctor, dashboardController.doctorDashboard);
router.get("/user", auth, dashboardController.userDashboard);


module.exports = router;
