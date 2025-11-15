import React, { useState, useContext, useEffect } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoanApply() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    amountRequested: "",
    tenureMonths: 12,
    interestRate: "",
    officerId: "" // selected officer
  });
  const [loading, setLoading] = useState(false);
  const [officers, setOfficers] = useState([]);

  // Fetch officers on component mount
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await api.get("/officer/list"); // endpoint to get all officers
        setOfficers(res.data); // assuming res.data = [{ _id, name, customerId }]
      } catch (err) {
        toast.error("Error fetching officers");
      }
    };
    fetchOfficers();
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.officerId) {
      toast.error("Please select a loan officer");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerId: user.userId,
        amountRequested: Number(form.amountRequested),
        tenureMonths: Number(form.tenureMonths),
        interestRate: Number(form.interestRate),
        officerId: form.officerId
      };

      const res = await api.post("/loans/apply", payload);
      toast.success(res.data.message || "Application submitted");
      navigate(`/customer/status/${res.data.loanId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error submitting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Apply for Loan</h2>
      <form onSubmit={submit}>
        <label>Amount Requested</label>
        <input
          name="amountRequested"
          type="number"
          value={form.amountRequested}
          onChange={handle}
          required
        />

        <label>Tenure (months)</label>
        <input
          name="tenureMonths"
          type="number"
          value={form.tenureMonths}
          onChange={handle}
          required
        />

        <label>Interest Rate (%)</label>
        <input
          name="interestRate"
          type="number"
          value={form.interestRate}
          onChange={handle}
          required
        />

        <label>Select Loan Officer</label>
        <select
          name="officerId"
          value={form.officerId}
          onChange={handle}
          required
        >
          <option value="">-- Select Officer --</option>
          {officers.map((officer) => (
            <option key={officer._id} value={officer.customerId}>
              {officer.name} (Branch : {officer.branch})
            </option>
          ))}
        </select>

        <button className="btn" disabled={loading}>
          {loading ? "Submitting..." : "Apply"}
        </button>
      </form>
    </div>
  );
}
