const LoanApplication = require("../model/LoanApplication");
const { evaluateLoan } = require("../services/loanServices");

const Customer = require("../model/CustomerModel");

const LoanOfficer = require("../model/LoanOfficer"); 
const User = require("../model/UserModel"); 

const getOfficersList = async (req, res) => {
  try {
    const officers = await LoanOfficer.find().lean();
    console.log(`Total loan officers found: ${officers.length}`);

    const userIds = officers.map((o) => o.customerId);

    const users = await User.find(
      { _id: { $in: userIds } },
      { name: 1 }
    ).lean();

    const userMap = {};
    users.forEach((u) => {
      userMap[u._id.toString()] = u.name;
    });

    const result = officers.map((officer) => ({
      _id: officer._id,
      customerId: officer.customerId,
      name: userMap[officer.customerId.toString()] || "Unknown",
      branch: officer.branch,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching loan officers:", err);
    res.status(500).json({ message: "Error fetching loan officers", err });
  }
};

const getPendingByOfficer = async (req, res) => {
  try {
    const { officerId } = req.body;
    if (!officerId) {
      return res.status(400).json({ message: "officerId is required" });
    }

    console.log("Fetching pending loans for officer:", officerId);

    let loans = await LoanApplication.find({
      status: "PENDING",
      officerId: officerId,
    }).lean();
    console.log(`Total pending loans fetched: ${loans.length}`);

    const customerIds = loans.map((loan) => loan.customerId).filter((id) => id);

    const customers = await Customer.find({
      customerId: { $in: customerIds },
    }).lean();

    const customerMap = {};
    customers.forEach((c) => {
      customerMap[c.customerId.toString()] = c;
    });

    loans = loans.map((loan) => ({
      ...loan,
      customerId: loan.customerId
        ? customerMap[loan.customerId.toString()] || {}
        : {},
    }));

    console.log("Final pending loans for officer:", loans);
    res.json(loans);
  } catch (err) {
    console.error("Error fetching pending loans by officer:", err);
    res.status(500).json({ message: "Error fetching pending loans", err });
  }
};

const getApprovedByOfficer = async (req, res) => {
  try {
    const { officerId } = req.body;
    if (!officerId) {
      return res.status(400).json({ message: "officerId is required" });
    }

    console.log("Fetching approved loans for officer:", officerId);

    let loans = await LoanApplication.find({
      status: "APPROVED",
      officerId: officerId,
    }).lean();
    console.log(`Total approved loans fetched: ${loans.length}`);

    const customerIds = loans.map((loan) => loan.customerId).filter(Boolean);
    console.log("Customer IDs extracted from loans:", customerIds);

    const customers = await Customer.find({
      customerId: { $in: customerIds },
    }).lean();
    console.log(`Total customers found: ${customers.length}`);

    const customerMap = {};
    customers.forEach((c) => {
      customerMap[c.customerId.toString()] = c;
    });
    console.log("Customer map created:", customerMap);

    loans = loans.map((loan) => {
      const populatedCustomer = loan.customerId
        ? customerMap[loan.customerId.toString()] || {}
        : {};
      if (!populatedCustomer || Object.keys(populatedCustomer).length === 0) {
        console.log(`Warning: Customer not found for loanId ${loan._id}`);
      }
      return {
        ...loan,
        customerId: populatedCustomer,
      };
    });

    console.log("Final approved loans for officer:", loans);
    res.json(loans);
  } catch (err) {
    console.error("Error fetching approved loans by officer:", err);
    res.status(500).json({ message: "Error fetching approved loans", err });
  }
};

const getRejectedByOfficer = async (req, res) => {
  try {
    const { officerId } = req.body;
    if (!officerId) {
      return res.status(400).json({ message: "officerId is required" });
    }

    console.log("Fetching rejected loans for officer:", officerId);

    let loans = await LoanApplication.find({
      status: "REJECTED",
      officerId: officerId,
    }).lean();
    console.log(`Total rejected loans fetched: ${loans.length}`);

    const customerIds = loans.map((loan) => loan.customerId).filter(Boolean);
    console.log("Customer IDs extracted from loans:", customerIds);

    const customers = await Customer.find({
      customerId: { $in: customerIds },
    }).lean();
    console.log(`Total customers found: ${customers.length}`);

    const customerMap = {};
    customers.forEach((c) => {
      customerMap[c.customerId.toString()] = c;
    });
    console.log("Customer map created:", customerMap);

    loans = loans.map((loan) => {
      const populatedCustomer = loan.customerId
        ? customerMap[loan.customerId.toString()] || {}
        : {};
      if (!populatedCustomer || Object.keys(populatedCustomer).length === 0) {
        console.log(`Warning: Customer not found for loanId ${loan._id}`);
      }
      return {
        ...loan,
        customerId: populatedCustomer,
      };
    });

    console.log("Final rejected loans for officer:", loans);
    res.json(loans);
  } catch (err) {
    console.error("Error fetching rejected loans by officer:", err);
    res.status(500).json({ message: "Error fetching rejected loans", err });
  }
};

const reviewLoan = async (req, res) => {
  try {

    const { id } = req.params;
    console.log("Loan ID from params:", id);

    if (!id) {
      console.log(" No loan ID provided");
      return res.status(400).json({ message: "Loan ID is required" });
    }

    console.log("31 Evaluating loan...", id);
    const result = await evaluateLoan(id);

    console.log("Loan evaluation result:", result);

    res.json({
      message: "Loan reviewed",
      status: result.status,
      score: result.score,
    });

  } catch (err) {
    console.error("Error in reviewLoan:", err.message);
    res
      .status(500)
      .json({ message: "Error reviewing loan", error: err.message });
  }
};

module.exports = {
  reviewLoan,
  getOfficersList,

  getPendingByOfficer,
  getApprovedByOfficer,
  getRejectedByOfficer,
};
