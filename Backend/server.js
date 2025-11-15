

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {connectDB} = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const loanRoutes = require("./routes/loanRoutes");
const officerRoutes = require("./routes/officerRoutes");
const customerRoutes = require("./routes/customerRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/loans", loanRoutes);
app.use("/officer", officerRoutes);
app.use("/customer", customerRoutes);

app.get("/", (req, res) => res.send("Loan System API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

