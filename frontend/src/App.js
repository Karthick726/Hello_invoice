import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import InvoiceForm from "./components/createInvoiceForm/CreateInvoice";
import Layout from "./Layout";
import Login from "./components/login/Login";
import CreateInvoice from "./components/createInvoiceForm/CreateInvoice";
import AxiosInstance from "./components/api/AxiosInstance";
import InvoiceList from "./components/invoiceList/InvoiceList";
import CompanyInfo from "./components/companyInfo/CompanyInfo";
import CreateInvoiceFronetEndPdf from "./components/createInvoiceForm/CreateInvocieFronetEndPdf";
import ProfomaInvoice from "./components/getInvoice/ProfomaInvoice";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("auth") ? true : false;
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await AxiosInstance.post("/api/admin-logout", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.removeItem("auth");
      alert("Logged out successfully.");
      window.location.reload();
      // navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Layout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* <Route index element={<CreateInvoice />} /> */}
          <Route index element={<CreateInvoiceFronetEndPdf />} />
          <Route path="/get-proforma-invoice" element={<ProfomaInvoice />} />
          <Route path="/update-info" element={<CompanyInfo />} />
        </Route>
        <Route path="*" element={<h2>404 error</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
