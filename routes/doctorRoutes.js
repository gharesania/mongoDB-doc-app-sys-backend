const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { auth, admin } = require("../middleware/auth.js");

router.post('/apply', auth, doctorController.applyDoctor)
router.patch('/docStatus/:DoctorID', auth, admin, doctorController.docStatus)
router.get('/docApplyList', auth, admin, doctorController.docApplyList)

module.exports = router;
