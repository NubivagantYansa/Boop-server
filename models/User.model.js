// models/User.model.js

const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;
const { isProd } = require("../utils");

const userSchema = new Schema(
  {
    userRole: {
      type: String,
      enum: ["Dog owner", "Dogsitter"],
      required: isProd ? [true, "Type of user is required."] : false,
    },
    username: {
      type: String,
      trim: true,
      required: isProd ? [true, "Username is required."] : false,
      unique: true,
    },
    email: {
      type: String,
      required: isProd ? [true, "Email is required."] : false,
      // match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: isProd ? [true, "Password is required."] : false,
    },
    //  confirmed: {
    //   type: Boolean,
    //   defaultValue: false,
    // },
    image: {
      type: String,
      required: isProd ? [true, "Image is required."] : false,
    },
    aboutMe: {
      type: String,
      required: isProd ? [true, "A brief description is required."] : false,
    },
    borough: {
      type: String,
      required: isProd ? [true, "Please pick a Borough"] : false,
    },
    features: { type: ObjectId, ref: "Features" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
