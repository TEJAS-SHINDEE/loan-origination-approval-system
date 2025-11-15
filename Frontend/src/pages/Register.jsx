import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    income: "",
    creditScore: "",
    branch: ""
  });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      // convert numeric fields if present
      if (payload.role === "CUSTOMER") {
        payload.income = payload.income ? Number(payload.income) : undefined;
        payload.creditScore = payload.creditScore ? Number(payload.creditScore) : undefined;
      }
      await register(payload);
    } catch (err) {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handle} required />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handle} required />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handle} required />

        <label>Role</label>
        <select name="role" value={form.role} onChange={handle}>
          <option value="CUSTOMER">Customer</option>
          <option value="OFFICER">Loan Officer</option>
        </select>

        {form.role === "CUSTOMER" && (
          <>
            <label>Income (annual)</label>
            <input name="income" value={form.income} onChange={handle} type="number" />
            <label>Credit Score</label>
            <input name="creditScore" value={form.creditScore} onChange={handle} type="number" />
          </>
        )}

        {form.role === "OFFICER" && (
          <>
            <label>Branch</label>
            <input name="branch" value={form.branch} onChange={handle} />
          </>
        )}

        <button className="btn" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
      </form>
    </div>
  );
}
