const express = require("express");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/role");
const {
  reviewLoan,
  getOfficersList,
  getPendingByOfficer,
  getApprovedByOfficer,
  getRejectedByOfficer,
} = require("../Controller/officerController");

const router = express.Router();

router.get("/list", auth, getOfficersList);

router.post("/loans/pending", auth, allowRoles("OFFICER"), getPendingByOfficer);

router.post(
  "/loans/approved",
  auth,
  allowRoles("OFFICER"),
  getApprovedByOfficer
);

router.post(
  "/loans/rejected",
  auth,
  allowRoles("OFFICER"),
  getRejectedByOfficer
);

router.post("/loans/review/:id", auth, allowRoles("OFFICER"), reviewLoan);

module.exports = router;
