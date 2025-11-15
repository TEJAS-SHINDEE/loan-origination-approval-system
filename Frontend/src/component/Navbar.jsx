import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  console.log("7 user name ", user);

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">LoanSys</Link>
        {user?.token && user.role === "CUSTOMER" && (
          <>
            <Link to="/customer" className="nav-link">Dashboard</Link>
            <Link to="/customer/apply" className="nav-link">Apply</Link>
            <Link to="/customer/loans" className="nav-link">View Application's</Link>
          </>
        )}
        {user?.token && user.role === "OFFICER" && (
          <>
            <Link to="/officer" className="nav-link">Officer</Link>
            <Link to="/officer/pending" className="nav-link">Pending</Link>
            <Link to="/officer/approved" className="nav-link">Approved</Link>
            <Link to="/officer/rejected" className="nav-link">Rejected</Link>
          </>
        )}
      </div>

      <div className="nav-right">
        {user?.token ? (
          <>
            <span className="nav-user">Hi, {user.name || user.role}</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
