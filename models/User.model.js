// models/User.model.js

const { Schema, model } = require("mongoose");
const { isProd } = require("../utils");

const userSchema = new Schema(
  {
    userRole: {
      type: String,
      enum: ["Dog owner", "Dogsitter"],
      required:
        isProd === "production" ? [true, "Type of user is required."] : false,
    },
    username: {
      type: String,
      trim: true,
      required:
        isProd === "production" ? [true, "Username is required."] : false,
      unique: true,
    },
    email: {
      type: String,
      required: isProd === "production" ? [true, "Email is required."] : false,
      // this match will disqualify all the emails with accidental empty spaces, missing dots in front of (.)com and the ones with no domain at all
      // match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required:
        isProd === "production" ? [true, "Password is required."] : false,
    },
    image: {
      type: String,
      required: isProd === "production" ? [true, "Image is required."] : false,
    },
    aboutMe: {
      type: String,
      required:
        isProd === "production"
          ? [true, "A brief description is required."]
          : false,
    },
    borough: {
      type: String,
      required:
        isProd === "production" ? [true, "Please pick a Borough"] : false,
    },
    features: [{ type: Schema.Types.ObjectId, ref: "Features" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
