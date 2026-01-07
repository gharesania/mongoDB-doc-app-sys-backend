const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {auth, admin} = require("../middleware/auth.js");
const upload = require('../middleware/multer');

//Auth
router.post('/register', upload.single('userImage'),userController.register);
router.post("/login", userController.login);

//Profile
router.get("/getUserInfo", auth, userController.getUserInfo);

//Lists
// router.get('/doctorList',auth, userController.doctorList);
// router.get('/userList',auth, admin, userController.userList);
// router.put('/updateUser', auth, upload, userController.updateUser)

module.exports = router;