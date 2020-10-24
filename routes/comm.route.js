// routes/user.routes.js
const router = require("express").Router();
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Features = require("../models/Features.model");
const mongoose = require("mongoose");

const { isProd } = require("../utils");

/**  ============================
 *         Get all profiles
 *   ============================
 */

router.get("/get-profiles", async (req, res) => {
  try {
    const profilesList = await User.find()
      .populate("features")
      .sort({ createdAt: -1 });
    console.log("PROFILES LIST", profilesList);
    return res.status(200).json({
      profilesList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error });
  }
});

/**  ============================
 *         Get single profiles
 *   ============================
 */

module.exports = router;
