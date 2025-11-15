const mongoose = require("mongoose");
const { Schema } = mongoose;

const loanAppSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    officerId: { type: Schema.Types.ObjectId, ref: "LoanOfficer" },
    amountRequested: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    interestRate: Number,
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },
    eligibilityScore: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoanApplication", loanAppSchema);
