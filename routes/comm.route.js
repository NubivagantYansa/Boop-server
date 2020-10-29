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

/**  ============================
 *         Send Email - user to user
 *   ============================
 */

// .post() route ==> to process form data
router.post("/send-email/:receiver", async (req, res, next) => {
  const { bodyEmail, sender } = req.body;
  const { receiver } = req.params;

  // validation entries and link confirmation
  if (!bodyEmail) {
    res.status(400).json({
      errorMessage: "Please write a message for the user.",
    });
    return;
  }

  try {
    //find senderProfile
    const senderProfile = await User.findById(sender);
    console.log("senderProfile", senderProfile);
    // throws error if it can't find user
    if (!user) {
      return res.status(404).json({
        errorMessage: "Your session expired. Please, login again",
      });
    }

    //find receiverProfile
    const receiverProfile = await User.findById(receiver);
    console.log("receiverProfile", receiverProfile);
    // throws error if it can't find user
    if (!receiverProfile) {
      return res.status(404).json({
        errorMessage:
          "Sorry! There was a problem when sending the email. The account might not longer exist.",
      });
    }

    //send email

    const mailDetails = {
      from: `"Our Code World " ${process.env.EMAIL}`,
      to: `${receiverProfile.email}`,
      subject: `Boop - Someone is interested in your profile`,
      // text: `Hello , welcome to Boop! `,
      html: `<h1>Hello, ${receiverProfile.username}!<h1> <b>${senderProfile.username} has just sent you the a message! <strong>Message:</strong><p>${bodyEmail}</p></b>`,
    };

    const mailSent = await mailTransporter.sendEmail(
      mailDetails,
      (error, data) => {
        if (error) {
          res.status(400).json({
            errorMessage: "Error while sendin email, ",
            error,
          });
          return;
        } else {
          console.log("Email sent successfully", data);
        }
      }
    );
    return res.status(200).json({
      success: "Email sent",
    });
  } catch (error) {
    res.status(500).json({ errorMessage: error });
  }
});
module.exports = router;
