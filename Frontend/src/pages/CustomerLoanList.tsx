
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { Link } from "react-router-dom";

interface Loan {
  _id: string;
  amountRequested: number;
  tenureMonths: number;
  status: string;
  createdAt: string;
  eligibilityScore?: number;
}

const CustomerLoanList: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLoans = async () => {
    try {
      const res = await api.get(`/loans/customer/${user.userId}`);
      setLoans(res.data);
    } catch (err) {
      console.error("Error fetching loans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>Your Loan Applications</h2>

      {loans.length === 0 && <p>You have no loan applications.</p>}

      {loans.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Amount</th>
              <th>Tenure</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Check Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td>{loan._id}</td>
                <td>{loan.amountRequested}</td>
                <td>{loan.tenureMonths} months</td>
                <td>{loan.status}</td>
                <td>{new Date(loan.createdAt).toLocaleString()}</td>
                <td>
                  <Link to={`/customer/status/${loan._id}`}>
                    <button className="btn">View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerLoanList;
