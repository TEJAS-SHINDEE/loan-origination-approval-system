import React, { useContext, useEffect, } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";

export default function OfficerDashboard() {
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    fetchUserData();

  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/customer/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("23 data ", res.data);
      setUser(prev => ({
        ...prev,
        name: res.data.name
      }));
    } catch (err) {
      console.log("Failed to fetch user", err.message);
    }
  };

  return (
    <div className="card">
      <h2>Loan Officer Dashboard</h2>
      <ul>
        <li><Link to="/officer/pending">View pending loan applications</Link></li>
        <p></p>
        <li><Link to="/officer/approved">View approved loan applications</Link></li>
        <p></p>
        <li><Link to="/officer/rejected">View rejected loan applications</Link></li>
      </ul>
    </div>
  );
}
