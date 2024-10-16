const express = require("express");
const MerchantController = require("../controllers/MerchantController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/login", MerchantController.login);
router.post("/signup", MerchantController.signup); // to signup merchant for //for testing
router.get("/risk-score", auth, MerchantController.getRiskScore);
router.post("/rotate-api-key", auth, MerchantController.rotateApiKey);

module.exports = router;
