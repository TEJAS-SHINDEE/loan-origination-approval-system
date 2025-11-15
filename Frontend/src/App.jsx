import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../src/component/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import LoanApply from "./pages/LoanApply";
import LoanStatus from "./pages/LoanStatus";
import OfficerPending from "./pages/OfficerPending";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/AuthContext";
import CustomerLoanList from "./pages/CustomerLoanList";
import OfficerApproved from "./pages/OfficerApproved";
import OfficerRejected from "./pages/OfficerRejected";
import Header from "./component/Header";

const PrivateRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user?.token) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <>
      <Navbar />
      <ToastContainer />
<<<<<<< HEAD

      <div className="header">
        <Header />
      </div>

=======
      
>>>>>>> ded84c8683096faf330590be0d0263d7e2d3a343
      <div className="container">

        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/customer"
            element={
              <PrivateRoute roles={["CUSTOMER"]}>
                <CustomerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/apply"
            element={
              <PrivateRoute roles={["CUSTOMER"]}>
                <LoanApply />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/status/:id"
            element={
              <PrivateRoute roles={["CUSTOMER"]}>
                <LoanStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/loans"
            element={
              <PrivateRoute roles={["CUSTOMER"]}>
                <CustomerLoanList />
              </PrivateRoute>
            }
          />

          <Route
            path="/officer"
            element={
              <PrivateRoute roles={["OFFICER"]}>
                <OfficerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/officer/pending"
            element={
              <PrivateRoute roles={["OFFICER"]}>
                <OfficerPending />
              </PrivateRoute>
            }
          />
          <Route
            path="/officer/approved"
            element={
              <PrivateRoute roles={["OFFICER"]}>
                <OfficerApproved />
              </PrivateRoute>
            }
          />
          <Route
            path="/officer/rejected"
            element={
              <PrivateRoute roles={["OFFICER"]}>
                <OfficerRejected />
              </PrivateRoute>
            }
          />

        </Routes>
      </div>
    </>
  );
}
