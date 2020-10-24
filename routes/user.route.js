// routes/user.routes.js
const router = require("express").Router();
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Features = require("../models/Features.model");
const mongoose = require("mongoose");
const uploadCloud = require("../config/cloudinary");

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
  console.log("ACCESS TOKEN =>", req.headers.accesstoken);
  console.log("/user/edit =>", req.body);

  const accessToken = req.headers.accesstoken;
  const { userRole, username, email, aboutMe, image, borough } = req.body;
  const { features } = req.body.features;

  console.log("HELLOOOOO FEATURES", req.body.features);

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

  console.log("userInfoNew", userInfoNew);

  const featuresNew = Object.fromEntries(
    Object.entries(req.body.features).filter((el) => el[1])
  );
  console.log("featuresNew", req.body.features);

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
    console.log({ ...user });
    const featuresDB = await Features.findByIdAndUpdate(
      user.features,
      featuresNew,
      {
        new: true,
      }
    );
    return res.status(200).json({
      success: "user profile updated ",
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

/**  ============================
 *         Delete Profile
 *   ============================
 */

module.exports = router;
