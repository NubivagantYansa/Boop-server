const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const BookingSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User" },
    startdate: { type: Date, required: [true, "Start date is mandatory"] },
    enddate: {
      type: Date,
      required: [true, "End date is mandatory"],
    },
    bookingdate: { type: Date, default: Date.now() },
    dogId: { type: Object, ref: "User" },
    dogsitterId: { type: Object, ref: "User" },
    bookingstatus: {
      type: String,
      default: "available",
      enum: ["available", "pending", "close", "cancel"],
    },
  },
  { timestamps: true }
);
const Booking = model("Booking", BookingSchema);

module.exports = Bookings;
