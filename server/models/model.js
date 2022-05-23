const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password usign mongoose hook
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  let newPassword = this.password.toString();
  this.password = await bcrypt.hash(newPassword, salt);
  next();
});

// User Profile Schema with profile photo and user field
const userProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  profilePhoto: {
    type: Object,
  },
});

const User = mongoose.model("user", userSchema);
const userProfile = mongoose.model("userProfile", userProfileSchema);
module.exports = { User, userProfile };
