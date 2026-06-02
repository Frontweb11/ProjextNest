const express = require("express");
const router = express.Router();
const { getUserPortfolio } = require("../controllers/userController"); // adjust path

router.get("/portfolio/:id", getUserPortfolio);

module.exports = router;
