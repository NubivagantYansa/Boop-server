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

router.get("/get-profile/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const profile = await User.findById(id).populate("features");
    console.log("PROFILE FOUNDDD", profile);
    return res.status(200).json({
      profile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error });
  }
});

module.exports = router;
