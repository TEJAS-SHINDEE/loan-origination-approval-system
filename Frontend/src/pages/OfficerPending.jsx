import React, { useEffect, useState, useContext } from "react";
import api from "../api/axiosConfig";
import Loader from "../component/Loader.jsx";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

export default function OfficerPending() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { user, setUser } = useContext(AuthContext);

  console.log("13 officer id pending : ", user.userId);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await api.post("/officer/loans/pending", {
        officerId: user.userId 
      });
      setLoans(res.data || []);
    } catch (err) {
      toast.error("Failed to load pending loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const review = async (loanId) => {
    try {
      setActionLoading(loanId);
      // The backend evaluates automatically (score -> APPROVED/REJECTED)
      const res = await api.post(`/officer/loans/review/${loanId}`);
      toast.success(`Reviewed: ${res.data.status}`);
      await fetchLoans();
    } catch (err) {
      toast.error("Review failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  if (!loans.length) return <div className="card"><h3>No pending loans</h3></div>;

  return (
    <div className="card">
      <h2>Pending Loan Applications</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Tenure</th>
            <th>Applied At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l._id}>
              <td>{l._id}</td>
              <td>{l.customerId?.userId ? l.customerId.userId : (l.customerId?._id || "N/A")}</td>
              <td>{l.amountRequested}</td>
              <td>{l.tenureMonths}</td>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn"
                  disabled={actionLoading === l._id}
                  onClick={() => review(l._id)}
                >
                  {actionLoading === l._id ? "Reviewing..." : "Review"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
