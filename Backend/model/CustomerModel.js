const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  income: Number,
  creditScore: Number
});

module.exports = mongoose.model("Customer", customerSchema);
