// routes/user.routes.js
const router = require("express").Router();
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const Features = require("../models/Features.model");
const mongoose = require("mongoose");
const uploadCloud = require("../config/cloudinary");

router.post("/image", uploadCloud.single("image"), (req, res) => {
  console.log(req.file);
  res.json(req.file.path);
});

module.exports = router;
