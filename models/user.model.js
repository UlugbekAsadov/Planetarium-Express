const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
        "Please enter valid email address",
      ],
    },
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
  {
    timestamps: true,
  }
);

// hashing password with bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Check user entered password
userSchema.methods.matchPassword = async function (pass) {
  return await bcrypt.compare(pass, this.password);
};

// Generate jwt token
userSchema.methods.generateJwtToken = async function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", userSchema);
