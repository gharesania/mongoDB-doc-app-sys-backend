const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, admin } = require("../middleware/auth.js");
const upload = require("../middleware/multer");

//Auth
router.post("/register", upload.single("userImage"), userController.register);
router.post("/login", userController.login);

//Profile
router.get("/getUserInfo", auth, userController.getUserInfo);
router.put('/updateProfile', auth, upload.single("userImage"), userController.updateProfile)

// Lists
router.get("/doctors", auth, userController.getAllDoctors);
router.get("/users", auth, admin, userController.getAllUsers);

module.exports = router;