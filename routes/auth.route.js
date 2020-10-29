// routes/auth.routes.js

const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Features = require("../models/Features.model");
const mongoose = require("mongoose");
const { isProd } = require("../utils");
const { mailTransporter } = require("../utils/nodemailer");

/**  ============================
 *          Signup
 *   ============================
 */

// .post() route ==> to process form data
router.post("/signup", async (req, res, next) => {
  const {
    userRole,
    username,
    password: toHash,
    email,
    image,
    aboutMe,
    borough,
    features: featuresDb,
  } = req.body;

  // validation entries and link confirmation
  if (
    !username ||
    !userRole ||
    !email ||
    !toHash ||
    !aboutMe ||
    !borough ||
    !image
  ) {
    res.status(400).json({
      errorMessage:
        "All fields are mandatory. Please provide all the info required.",
    });
    return;
  }

  if (
    !featuresDb.size ||
    !featuresDb.energy ||
    !featuresDb.behaves ||
    !featuresDb.pottyTraining ||
    !featuresDb.chill ||
    !featuresDb.breed
  ) {
    res.status(400).json({
      errorMessage:
        "All fields are mandatory. Please provide all the info required.",
    });
    return;
  }

  // if (!user.confirmed) {
  //   res.status(400).json({
  //     errorMessage:
  //       "Please confirm the link.",
  //   });
  //   return;
  // }

  // makes sure passwords are strong:
  if (isProd) {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(toHash)) {
      res.status(400).json({
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }
  }

  try {
    // salt and hash password
    const salt = await bcryptjs.genSalt(saltRounds);
    const password = await bcryptjs.hash(toHash, salt);
    // create user
    const user = await User.create({
      userRole,
      username,
      password,
      email,
      image,
      aboutMe,
      borough,
    });
    // create session
    const session = await Session.create({
      userId: user._id,
      createdAt: Date.now(),
    });
    // create features
    const features = await Features.create({ ...featuresDb, author: user._id });
    // update user with features is
    const newUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { features: features._id } },
      { new: true }
    );

    //send email

    const mailDetails = {
      from: `"Our Code World " ${process.env.EMAIL}`,
      to: `${user.email}`,
      subject: `Boop Email Confirmation`,
      // text: `Hello , welcome to Boop! `,
      html: `<b><h1>Hello, ${user.username}</h1>,<p> welcome to Boop! </p><p>Here your details: <strong>email:  ${user.email}</strong><strong>password: toHash</strong>.</p><footnote>Login to edit your details or delete your profile</footnote></b>`,
    };

    const mailSent = await mailTransporter.sendEmail(
      mailDetails,
      (error, data) => {
        if (error) {
          res.status(400).json({
            errorMessage: "Error while sending email, ",
            error,
          });
          return;
        } else {
          console.log("Email sent successfully", data);
        }
      }
    );

    // send access Token and user (with features in the user object)
    return res.status(200).json({
      success: "user created  ",
      accessToken: session._id,
      user: { ...newUser.toJSON(), features: features },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(400).json({
        errorMessage:
          "Username and email need to be unique. Either username or email is already used.",
      });
    } else {
      res.status(500).json({ errorMessage: error });
    }
  }
});

/**  ============================
 *         Login
 *   ============================
 */

// .post() login route ==> to process form data
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // validation entries
  if (email === "" || password === "") {
    res.status(400).json({
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  try {
    //find user
    const user = await User.findOne({ email });
    console.log("user", user);
    // throws error if it can't find user
    if (!user) {
      return res.status(404).json({
        errorMessage: "Email is not registered. Try with other email.",
      });
    }
    //check if inserted password match the one stored in the database
    const passwordCheck = await bcryptjs.compareSync(password, user.password);

    if (!passwordCheck) {
      return res.status(400).json({ errorMessage: "Incorrect password." });
    }
    //creates session
    const session = await Session.create({
      userId: user._id,
      createdAt: Date.now(),
    });
    // finds features using user._id
    const featuresDB = await Features.findOne({ author: user._id });
    console.log("HERE THE FEATURES", featuresDB);

    return res.status(200).json({
      success: "user profile found ",
      accessToken: session._id,
      user: { ...user.toJSON(), features: featuresDB },
    });
  } catch (error) {
    res.status(500).json({ errorMessage: error });
  }
});

/**  ============================
 *          Logout
 *   ============================
 */

router.post("/logout/:_id", (req, res) => {
  const _id = req.params;
  Session.findByIdAndDelete(_id)
    .then(() => {
      res.status(200).json({ success: "User was logged out" });
    })
    .catch((error) => res.status(500).json({ errorMessage: error }));
});

/**  ============================
 *          Validate session token Router
 *   ============================
 */
router.get("/session/:accessToken", (req, res) => {
  const { accessToken } = req.params;
  Session.findById({ _id: accessToken })
    .populate("userId features")
    .populate({
      path: "userId",
      populate: {
        path: "features",
        model: "Features",
      },
    })

    .then((session) => {
      if (!session) {
        res.status(200).json({
          errorMessage: "Session does not exist",
        });
      } else {
        res.status(200).json({
          session,
        });
      }
    })
    .catch((err) => res.status(500).json({ errorMessage: err }));
});

module.exports = router;
