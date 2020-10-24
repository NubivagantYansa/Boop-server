// models/Features.model.js

const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;
const { isProd } = require("../utils");

const FeaturesSchema = new Schema(
  {
    author: { type: ObjectId, ref: "User" },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large"],
      required:
        isProd === "production"
          ? [true, "Size is required, pick one of the listed items"]
          : false,
    },
    energy: {
      type: String,
      enum: ["Tornado", "Chilled", "Couch potato"],
      required:
        isProd === "production"
          ? [true, "Energy level is required, pick one of the listed items"]
          : false,
    },
    behaves: {
      type: String,
      enum: ["Soldier", "I kinda get it", "huh?"],
      required:
        isProd === "production"
          ? [true, "Behavior is required, pick one of the listed items"]
          : false,
    },
    pottyTraining: {
      type: String,
      enum: ["Expert", "Okay", "Ouch!"],
      required:
        isProd === "production"
          ? [
              true,
              "Potty Training state is required, pick one of the listed items",
            ]
          : false,
    },
    chill: {
      type: String,
      enum: ["Indoor", "Outdoor"],
      required:
        isProd === "production"
          ? [true, "Chill preference is required, pick one of the listed items"]
          : false,
    },
    breed: {
      type: String,
      required:
        isProd === "production"
          ? [true, "Breed is required, pick one of the listed items"]
          : false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Features", FeaturesSchema);
