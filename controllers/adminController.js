const User = require("../models/userModel");

async function getAllDoctors(req, res) {
  try {
    const doctors = await User.find({ role: "Doctor" });
    console.log(doctors);

    if (!doctors) {
      return res
        .status(404)
        .send({ msg: "Error Fetching Doctors 👎🏻", success: false });
    } else {
      res
        .status(200)
        .send({
          msg: "Doctors fetched successfully",
          success: true,
          doctors: doctors,
        });
    }
  } catch (error) {
    console.error("Get Doctors Error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch doctor applications",
    });
  }
}

module.exports = { getAllDoctors };
