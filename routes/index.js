const merchantRoute = require("./Merchant");

const express = require("express");
const router = express.Router();

router.use("/merchant", merchantRoute);

module.exports = router;
