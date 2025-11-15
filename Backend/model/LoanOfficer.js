const mongoose = require("mongoose");
const { Schema } = mongoose;

const loanOfficerSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  branch: String
});

module.exports = mongoose.model("LoanOfficer", loanOfficerSchema);
