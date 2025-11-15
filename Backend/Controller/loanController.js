const CustomerModel = require("../model/CustomerModel");
const LoanApplication = require("../model/LoanApplication");
const {
  evaluateLoan,
  calculateEligibility,
} = require("../services/loanServices");

const applyLoan = async (req, res) => {
  try {
    const {
      customerId,
      amountRequested,
      tenureMonths,
      interestRate,
      officerId,
    } = req.body;

    console.log("Received apply loan data:", req.body);

    const userId = customerId;
    console.log("customer id ", userId);

    // Find the customer profile by ID
    const customer = await CustomerModel.findOne({ customerId });
    console.log("customer ", customer);

    if (!customer) {
      return res.status(404).json({ message: "Customer profile not found" });
    }

    const { status, eligibilityScore } = await calculateEligibility({
      customerId,
      amountRequested,
    });

    const loan = await LoanApplication.create({
      customerId: customer.customerId, 
      amountRequested,
      tenureMonths,
      interestRate: 10,
      interestRate: interestRate,
      officerId: officerId,
      eligibilityScore: eligibilityScore,
    });

    console.log("30 loan created ", loan);

    res.json({ loanId: loan._id, message: "Loan application submitted." });
  } catch (err) {
    console.error("Error applying loan:", err);
    res.status(500).json({ message: "Error applying loan", err });
  }
};

const checkStatus = async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);

    if (!loan) return res.status(404).json({ message: "Not found" });

    res.json({
      status: loan.status,
      eligibilityScore: loan.eligibilityScore,
    });
  } catch (err) {
    res.status(500).json({ message: "Error", err });
  }
};

const getLoansByCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("52 logs ", id);
    const loans = await LoanApplication.find({ customerId: id }).sort({
      createdAt: -1,
    });

    return res.json(loans);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching loans" });
  }
};

module.exports = {
  applyLoan,
  checkStatus,
  getLoansByCustomer,
};
