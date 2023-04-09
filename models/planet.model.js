const mongoose = require("mongoose");

const planetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    distanceToStar: {
      type: Number,
      required: true,
    },
    diametr: {
      type: Number,
      required: true,
    },
    yearDuration: {
      type: Number,
      required: true,
    },
    dayDuration: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    sequenceNumber: {
      type: String,
      required: true,
    },
    satellites: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    star: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Star",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Planet", planetSchema);
