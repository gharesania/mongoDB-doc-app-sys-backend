const express = require("express");
const router = express.Router();
const { auth, admin } = require("../middleware/auth.js");
const dashboardController = require("../controllers/dashboardController");

router.get("/admin", auth, admin, dashboardController.getAdminDashboard);


module.exports = router;
