import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
    } catch (err) {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3></h3>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handle} required />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handle} required />
        <button className="btn" disabled={loading}>{loading ? "Logging..." : "Login"}</button>
      </form>
    </div>
  );
}
