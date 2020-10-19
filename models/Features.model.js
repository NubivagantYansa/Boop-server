// models/Features.model.js

const { Schema, model } = require("mongoose");

const FeaturesSchema = new Schema(
  {
    size: {
      type: String,
      enum: ["small", "medium", "large"],
      required: [true, "Size is required, pick one of the listed items"],
    },
    energy: {
      type: String,
      enum: ["tornado", "chilled", "couch potato"],
      required: [
        true,
        "Energy level is required, pick one of the listed items",
      ],
    },
    behaves: {
      type: String,
      enum: ["soldier", "I kinda get it", "huh?"],
      required: [true, "Behavior is required, pick one of the listed items"],
    },
    pottyTraining: {
      type: String,
      enum: ["expert", "okay", "ouch!"],
      required: [
        true,
        "Potty Training state is required, pick one of the listed items",
      ],
    },
    chill: {
      type: String,
      enum: ["indoor", "outdoor"],
      required: [true, "Energy is required, pick one of the listed items"],
    },
    breed: {
      type: String,
      required: [true, "Energy is required, pick one of the listed items"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Features", FeaturesSchema);
