const Merchant = require("../models/Merchant");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../config/config");

const MerchantController = {
  calculateRiskScore(merchant) {
    let score = 0;
    const passwordAge =
      (new Date() - new Date(merchant.passwordUpdated)) / (1000 * 60 * 60 * 24); // Age in days

    if (passwordAge > 90) score += 20;
    if (passwordAge > 180) score += 40;

    if (!merchant.twoFactorAuthEnabled) score += 30;

    const apiKeyAge =
      (new Date() - new Date(merchant.apiKeyLastRotated)) /
      (1000 * 60 * 60 * 24);
    if (apiKeyAge > 90) score += 30;

    return score;
  },

  async login(req, res) {
    const { username, password } = req.body;

    try {
      const merchant = await Merchant.findOne({ username });
      if (!merchant) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const isMatch = await bcrypt.compare(password, merchant.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const token = jwt.sign({ id: merchant._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },

  async getRiskScore(req, res) {
    try {
      const merchant = await Merchant.findById(req.merchantId);
      const riskScore = MerchantController.calculateRiskScore(merchant);
      res.status(200).json({ riskScore });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
  async rotateApiKey(req, res) {
    try {
      const merchant = await Merchant.findById(req.merchantId);
      if (!merchant) {
        return res.status(404).json({ message: "Merchant not found" });
      }

      const newApiKey = crypto.randomBytes(20).toString("hex");
      merchant.apiKey = newApiKey;
      merchant.apiKeyLastRotated = new Date();

      await merchant.save();
      res
        .status(200)
        .json({ message: "API key rotated successfully", apiKey: newApiKey });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
  async signup(req, res) {
    const { username, password, country, twoFactorAuthEnabled } = req.body;

    try {
      let existingMerchant = await Merchant.findOne({ username });
      if (existingMerchant) {
        return res.status(400).json({ message: "Merchant already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newMerchant = new Merchant({
        username,
        password: hashedPassword,
        passwordUpdated: new Date(),
        twoFactorAuthEnabled,
        country,
      });

      await newMerchant.save();

      const token = jwt.sign({ id: newMerchant._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({
        message: "Merchant registered successfully",
        token,
        merchant: {
          id: newMerchant._id,
          username: newMerchant.username,
          country: newMerchant.country,
          apiKey: newMerchant.apiKey,
          twoFactorAuthEnabled: newMerchant.twoFactorAuthEnabled,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering merchant", error: error.message });
    }
  },
};
module.exports = MerchantController;
