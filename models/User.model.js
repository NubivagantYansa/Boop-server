// models/User.model.js

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    userRole: {
      type: String,
      enum: ["doggo", "doggositter"],
      required: [true, "Type of user is required."],
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      // this match will disqualify all the emails with accidental empty spaces, missing dots in front of (.)com and the ones with no domain at all
      // match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    aboutMe: {
      type: String,
      required: [true, "A brief description is required."],
    },
    borough: {
      type: String,
      required: [true, "Please pick a Borough"],
    },
    Features: [{ type: Schema.Types.ObjectId, ref: "Features" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
