const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Please enter valid email  address",
      ],
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      apiKey: {
        type: String,
        unique: true,
        required: true,
      },
      balance: {
        type: Number,
        default: 0,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
