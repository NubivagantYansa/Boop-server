// routes/user.routes.js
const router = require("express").Router();
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Features = require("../models/Features.model");
const mongoose = require("mongoose");
const { mailTransporter } = require("../utils/nodemailer");
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
    return res.status(500).json({ errorMessage: error });
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
    return res.status(200).json({
      profile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMessage: error });
  }
});

/**  ============================
 *         Send Email - user to user
 *   ============================
 */

// .post() route ==> to process form data
router.post("/send-email/:receiver", async (req, res, next) => {
  const { bodyEmail, sender } = req.body;
  const { receiver } = req.params;
  console.log(bodyEmail);
  // validation entries and link confirmation
  if (!bodyEmail) {
    return res.status(400).json({
      errorMessage: "Please write a message for the user.",
    });
  }

  try {
    //find receiverProfile
    const receiverProfile = await User.findById(receiver);
    console.log("receiverProfileeeeeee", receiverProfile);

    //find senderProfile
    const senderProfile = await User.findById(sender);
    console.log("senderProfile", senderProfile);

    console.log("emaiLLLLLLLLLLLLLLLL", receiverProfile.email);
    //send email

    const mailDetails = {
      from: `Debora <${process.env.EMAIL}>`,
      to: receiverProfile.email,
      subject: `Boop - Someone is interested in your profile`,
      html: `<b>Hello, ${receiverProfile.username}!
      ${senderProfile.username} has just sent you a message! Message: ${bodyEmail}</b>`,
    };

    const mailSent = await mailTransporter.sendMail(mailDetails);

    return res.status(200).json({
      success: "Email sent",
      mailDetails,
    });
  } catch (error) {
    res.status(500).json({ errorMessage: error });
  }
});
module.exports = router;
