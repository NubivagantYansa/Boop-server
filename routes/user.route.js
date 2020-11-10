// routes/user.routes.js
const router = require("express").Router();
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Features = require("../models/Features.model");
const mongoose = require("mongoose");
const uploadCloud = require("../config/cloudinary");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const { isProd } = require("../utils");

/**  ============================
 *          Upload Image
 *   ============================
 */
router.post("/image", uploadCloud.single("image"), (req, res) => {
  console.log(req.file);
  res.json(req.file.path);
});

/**  ============================
 *         Edit Profile
 *   ============================
 */
router.post("/edit", async (req, res) => {
  const accessToken = req.headers.accesstoken;
  const {
    userRole,
    username,
    email,
    aboutMe,
    image,
    borough,
    features,
  } = req.body;

  const userInfoNew = Object.fromEntries(
    Object.entries({
      userRole,
      username,
      email,
      aboutMe,
      image,
      borough,
    }).filter((el) => el[1])
  );

  const featuresNew = Object.fromEntries(
    Object.entries(features).filter((el) => el[1])
  );

  try {
    const session = await Session.findById(accessToken);
    if (!session) {
      return res.status(400).json({ errorMessage: "Session not found" });
    }
    const user = await User.findByIdAndUpdate(session.userId, userInfoNew, {
      new: true,
    });
    if (!user) {
      return res.status(400).json({ errorMessage: "User not found" });
    }
    const featuresDB = await Features.findByIdAndUpdate(
      user.features,
      featuresNew,
      {
        new: true,
      }
    );
    return res.status(200).json({
      success: "user profile updated ",
      //...user.toJSON() is giving me the bit of the mongoose obj I need plus I overwrite the property features(which contains the features._id) wit hthe values that are contained in featuesDB which are the actual values
      user: { ...user.toJSON(), features: featuresDB },
      featuresDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: error });
  }
});

/**  ============================
 *         Edit Password
 *   ============================
 */
router.post("/edit-password", async (req, res) => {
  console.log("ACCESS TOKEN =>", req.headers.accesstoken);
  console.log("/user/edit-password =>", req.body);

  const accessToken = req.headers.accesstoken;
  const { password: toHash } = req.body;

  if (isProd) {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(toHash)) {
      return res.status(400).json({
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
    }
  }
  try {
    const session = await Session.findById(accessToken);
    if (!session) {
      return res.status(400).json({ errorMessage: "Session not found" });
    }

    const salt = await bcryptjs.genSalt(saltRounds);
    const password = await bcryptjs.hash(toHash, salt);
    console.log(password);

    const user = await User.findByIdAndUpdate(
      session.userId,
      { $set: { password } },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(400).json({ errorMessage: "User not found" });
    }
    const featuresDB = await Features.findById(user.features);
    return res.status(200).json({
      success: "user profile updated ",
      //...user.toJSON() is giving me the bit of the mongoose obj I need plus I overwrite the property features(which contains the features._id) wit hthe values that are contained in featuesDB which are the actual values
      user: { ...user.toJSON(), features: featuresDB },
      featuresDB,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMessage: error });
  }
});
/**  ============================
 *         Delete Profile
 *   ============================
 */

router.post("/delete-profile/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("reqPARMAS", userId);
  try {
    const features = await Features.findOne({ author: userId });
    const deletedUser = await User.findByIdAndDelete(userId);
    const deletedFeatures = await Features.findByIdAndDelete(features._id);
    return res.status(200).json({
      success: "user profile and features deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMessage: error });
  }
});

module.exports = router;
