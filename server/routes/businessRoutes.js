const express = require("express");

const router = express.Router();

const {
  registerBusiness,
} = require("../controllers/businessController");

router.post("/register", registerBusiness);

module.exports = router;