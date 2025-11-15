const User = require("../model/UserModel");
const Customer = require("../model/CustomerModel");
const LoanOfficer = require("../model/LoanOfficer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, role, income, creditScore, branch } =
      req.body;
    console.log("/register ", req.body);

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      role,
    });

    if (role === "CUSTOMER") {
      await Customer.create({ customerId: user._id, income, creditScore });
    }

    if (role === "OFFICER") {
      await LoanOfficer.create({ customerId: user._id, branch });
    }

    res.json({ message: "User registered successfully", customerId: user._id });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("43 /req ", req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Error", err });
  }
};

module.exports = {
  login,
  register,
};
