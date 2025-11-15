
const express = require("express");
const auth = require("../middleware/auth");
const { getMe } = require("../Controller/customerController");
const router = express.Router();


router.get("/me", auth, getMe);

module.exports = router;

