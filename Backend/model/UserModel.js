const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: { type: String, required: true }, // IMPORTANT
  role: { type: String, enum: ["CUSTOMER", "OFFICER", "ADMIN"], required: true }
});

module.exports = mongoose.model("User", userSchema);
