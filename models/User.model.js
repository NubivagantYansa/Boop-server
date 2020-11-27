// models/User.model.js

const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;
const { isProd } = require("../utils");
const geocoder = require("../utils/geocoder");

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
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: isProd ? [true, "Password is required."] : false,
    },
    image: {
      type: String,
      required: isProd ? [true, "Image is required."] : false,
    },
    aboutMe: {
      type: String,
      required: isProd ? [true, "A brief description is required."] : false,
    },
    address: {
      type: String,
      required: [true, "Please add an address."],
    },
    //from mapbox
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
    },
    features: { type: ObjectId, ref: "Features" },
  },
  {
    timestamps: true,
  }
);

//. Geocode and create location
//.pre --> it happens before it is saved in the database
userSchema.pre("save", async function (next) {
  const location = await geocoder.geocode(this.address);
  //format as a Point
  this.location = {
    type: "Point",
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
  };
  next();
});

module.exports = model("User", userSchema);
