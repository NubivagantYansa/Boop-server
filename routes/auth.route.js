// routes/auth.routes.js

const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Features = require("../models/Features.model");
const mongoose = require("mongoose");
const { isProd } = require("../utils");

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

  if (!username || !email || !toHash) {
    res.status(200).json({
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  // make sure passwords are strong:
  if (isProd) {
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(toHash)) {
      res.status(200).json({
        errorMessage:
          "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }
  }

  try {
    const salt = await bcryptjs.genSalt(saltRounds);
    const password = await bcryptjs.hash(toHash, salt);
    const user = await User.create({
      userRole,
      username,
      password,
      email,
      image,
      aboutMe,
      borough,
    });
    const session = await Session.create({
      userId: user._id,
      createdAt: Date.now(),
    });
    const features = await Features.create({ ...featuresDb, author: user._id });
    const newUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { features: features._id } },
      { new: true }
    );

    return res
      .status(200)
      .json({ accessToken: session._id, user: newUser, features });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(200).json({ errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(200).json({
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

  if (email === "" || password === "") {
    res.status(500).json({
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  try {
    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user) {
      return res.status(404).json({
        errorMessage: "Email is not registered. Try with other email.",
      });
    }
    const passwordCheck = await bcryptjs.compareSync(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({ errorMessage: "Incorrect password." });
    }

    const session = await Session.create({
      userId: user._id,
      createdAt: Date.now(),
    });

    const features = await Features.findOne({ author: user._id });
    console.log("HERE THE FEATURES", features);

    return res.status(200).json({ accessToken: session._id, user, features });
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
    .then((session) => {
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
