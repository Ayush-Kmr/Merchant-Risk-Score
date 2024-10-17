const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const riskController = require("../controllers/riskController");
const clientController = require("../controllers/ClientIdAndSecretContoller");
const updatePasswordController = require("../controllers/updatePasswordController");
const { searchAndValidateKey } = require("../controllers/searchController");
const auth = require("../middleware/auth");

// Authentication routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Risk management routes
router.get("/risk-score", auth, riskController.getRiskScore);

// Update Password
router.post("/update-password", auth, updatePasswordController.updatePassword);

// Generate ClientId and Client Secret
router.post(
  "/generate-client-credentials",
  auth,
  clientController.generateClientIdAndSecret
);

// POST route to trigger GitHub search and validation
router.post("/search", searchAndValidateKey);

module.exports = router;
