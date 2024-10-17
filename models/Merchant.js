const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const merchantSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  PasswordCreatedAt: { type: Date },
  passwordUpdated: { type: Date, default: Date.now },
  apiKey: { type: String },
  apiKeyLastRotated: { type: Date },
  twoFactorAuthEnabled: { type: Boolean, default: false },
  country: { type: String },
  previousPasswords: [{ type: String }],
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  clientId: { type: String, unique: true },
  clientSecret: { type: String },
  apiKeyCreatedAt: { type: Date },
  apiKeyUpdatedAt: { type: Date },
  riskScore: { type: Object },
  riskScoreUpdatedAt: { type: Date },
  merchantKey: { type: String },
  keyLeakDetected: { type: Boolean, default: false },
});
merchantSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.previousPasswords.length >= 5) {
      this.previousPasswords.shift();
    }
    this.previousPasswords.push(await bcrypt.hash(this.password, 10));
  }
  next();
});

module.exports = mongoose.model("Merchant", merchantSchema);
