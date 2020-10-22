// routes/auth.routes.js

const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Features = require("../models/Features.model");
const mongoose = require("mongoose");
const { isProd } = require("../utils");

//---------------> SIGNUP <---------------------------

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
    features,
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
    const feature = await Features.create({ ...features, author: user._id });
    const newUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { features: feature._id } },
      { new: true }
    );

    return res
      .status(200)
      .json({ accessToken: session._id, user: newUser, feature });
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

//---------------> LOGIN <---------------------------

// .post() login route ==> to process form data
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(500).json({
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(200).json({
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        Session.create({
          userId: user._id,
          createdAt: Date.now(),
        }).then((session) => {
          res.status(200).json({ accessToken: session._id, user });
        });
      } else {
        res.status(200).json({ errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => res.status(500).json({ errorMessage: error }));
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGOUT ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post("/logout", (req, res) => {
  Session.deleteOne({
    userId: req.body.accessToken,
  })
    .then((session) => {
      res.status(200).json({ success: "User was logged out" });
    })
    .catch((error) => res.status(500).json({ errorMessage: error }));
});

router.get("/session/:accessToken", (req, res) => {
  const { accessToken } = req.params;
  Session.findById({ _id: accessToken })
    .populate("userId")
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
