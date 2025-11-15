import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useParams } from "react-router-dom";
import Loader from "../component/Loader";

export default function LoanStatus() {
  const { id } = useParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/loans/${id}/status`);
        setStatus(res.data);
      } catch (err) {
        setStatus({ error: err?.response?.data?.message || "Error fetching" });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <Loader />;

  if (status?.error) return <div className="card"><h3>{status.error}</h3></div>;

  return (
    <div className="card">
      <h2>Loan Status</h2>
      <p><strong>Status:</strong> {status.status}</p>
      <p><strong>Eligibility Score:</strong> {typeof status.eligibilityScore === "number" ? status.eligibilityScore.toFixed(3) : "N/A"}</p>
    </div>
  );
}
