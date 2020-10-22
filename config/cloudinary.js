const { v2: cloudinary } = require("cloudinary");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  //from cloudinary website, to be stored in the env file
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "boop-profiles", //folder name
    allowed_formats: ["jpg", "png"],
  },
});

module.exports = multer({ storage });
