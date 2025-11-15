const express = require("express");
const auth = require("../middleware/auth");
const { applyLoan, checkStatus, getLoansByCustomer } = require("../controller/loanController");

const router = express.Router();

router.post("/apply", auth, applyLoan);
router.get("/:id/status", auth, checkStatus);
router.get("/customer/:id", auth, getLoansByCustomer)

module.exports = router;
