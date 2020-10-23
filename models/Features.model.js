// models/Features.model.js

const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;
const { isProd } = require("../utils");

const FeaturesSchema = new Schema(
  {
    author: { type: ObjectId, ref: "User" },
    size: {
      type: String,
      enum: ["small", "medium", "large"],
      required:
        isProd === "production"
          ? [true, "Size is required, pick one of the listed items"]
          : false,
    },
    energy: {
      type: String,
      enum: ["tornado", "chilled", "couch potato"],
      required:
        isProd === "production"
          ? [true, "Energy level is required, pick one of the listed items"]
          : false,
    },
    behaves: {
      type: String,
      enum: ["soldier", "I kinda get it", "huh?"],
      required:
        isProd === "production"
          ? [true, "Behavior is required, pick one of the listed items"]
          : false,
    },
    pottyTraining: {
      type: String,
      enum: ["expert", "okay", "ouch!"],
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
      enum: ["indoor", "outdoor"],
      required:
        isProd === "production"
          ? [true, "Energy is required, pick one of the listed items"]
          : false,
    },
    breed: {
      type: String,
      required:
        isProd === "production"
          ? [true, "Energy is required, pick one of the listed items"]
          : false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Features", FeaturesSchema);
