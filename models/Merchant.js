const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const merchantSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apiKey: { type: String },
  apiKeyLastRotated: { type: Date },
  twoFactorAuthEnabled: { type: Boolean, default: false },
  passwordUpdated: { type: Date, default: Date.now },
  country: { type: String },
});

module.exports = mongoose.model("Merchant", merchantSchema);
