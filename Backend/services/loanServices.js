const LoanApplication = require("../model/LoanApplication")
const CustomerModel = require("../model/CustomerModel")

const MAX_INCOME = 100000
const MAX_CREDIT_SCORE = 850
const SCORE_THRESHOLD = 0.6

const calculateEligibility = async ({ customerId, amountRequested }) => {
  const customer = await CustomerModel.findOne({ customerId })
  if (!customer) {
    console.log("Customer not found, loan will be rejected")
    return { status: "REJECTED", eligibilityScore: 0 }
  }

  const { income, creditScore } = customer

  const incomeNorm = Math.min(income / MAX_INCOME, 1)
  const creditScoreNorm = Math.min(creditScore / MAX_CREDIT_SCORE, 1)

  let eligibilityScore = 0.4 * incomeNorm + 0.6 * creditScoreNorm

  const amountFactor = amountRequested / 1000000
  const finalScore = Math.max(eligibilityScore - amountFactor, 0)

  const status = finalScore >= SCORE_THRESHOLD ? "APPROVED" : "REJECTED"

  return { status, eligibilityScore: finalScore }
}

const evaluateLoan = async (loanId) => {

  const loan = await LoanApplication.findById(loanId)

  if (!loan) {
    throw new Error("Loan not found")
  }

  if (!loan.customerId) {
    console.log("Customer is NULL in loan record")
    return { status: "REJECTED", score: 0, reason: "Customer profile missing" }
  }

  const customer = await CustomerModel.findOne({ customerId: loan.customerId })

  if (!customer) {
    return { status: "REJECTED", score: 0, reason: "Customer not found" }
  }

  const { income, creditScore } = customer

  const incomeNorm = Math.min(income / MAX_INCOME, 1)
  const creditScoreNorm = Math.min(creditScore / MAX_CREDIT_SCORE, 1)

  const eligibilityScore = 0.4 * incomeNorm + 0.6 * creditScoreNorm

  const amountFactor = loan.amountRequested / 1000000
  const finalScore = eligibilityScore - amountFactor

  const status = finalScore >= SCORE_THRESHOLD ? "APPROVED" : "REJECTED"

  loan.status = status
  await loan.save()

  return { status, score: finalScore }
}

module.exports = {
  calculateEligibility,
  evaluateLoan,
}
