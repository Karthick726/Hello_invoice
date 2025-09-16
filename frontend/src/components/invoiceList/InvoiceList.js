import React, { useEffect, useState } from "react";
import axiosInstance from "../api/AxiosInstance";
import "./InvoiceList.css";
import { FaFileDownload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { LuIndianRupee } from "react-icons/lu";

import { motion, AnimatePresence } from "framer-motion";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get("/api/get-all-invoices");
      setInvoices(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("auth");
        window.location.href = "/login";
      } else {
        console.error("Error fetching invoices:", error);
      }
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("No valid URL available for download.");
    }
  };

  const handleDeleteService = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/api/delete-invoice/${id}`);
      alert("Invoice deleted");
      fetchInvoices();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("auth");
        window.location.href = "/login";
      } else {
        console.error("Error fetching invoices:", error);
      }
    }
  };

  return (
    <div className="container-fluid mt-4">
      <h2
        className="Invoice-title fw-bold mb-4 text-center text-uppercase"
        style={{ letterSpacing: "2px", color: "#e31b25" }}
      >
        Invoice List
      </h2>
      <div className="table-responsive invoice-list-table ">
        <table className="table table-bordered me-3">
          <thead className="thead-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Service</th>
              <th>Download</th>
              <th>Action</th>
            </tr>
          </thead>
          <AnimatePresence>
            <motion.tbody
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No invoices available.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td>
                      {invoice.items.map((item, index) => (
                        <p>{item.invoiceNumber}</p>
                      ))}
                    </td>
                    <td>{invoice.clientName}</td>
                    <td>{invoice.clientEmail}</td>
                    <td>{invoice.phone}</td>
                    <td>
                      {invoice.Address.street}, {invoice.Address.district},{" "}
                      {invoice.Address.state}, {invoice.Address.country},{" "}
                      {invoice.Address.pincode}
                    </td>
                    <td>
                      <ul className="list-unstyled mb-0">
                        {invoice.items.map((item, index) => (
                          <li key={index}>
                            <span className="text-danger">
                              {" "}
                              {item.description}
                            </span>
                            - <LuIndianRupee />
                            {item.price} x {item.quantity}{" "}
                            <span style={{ color: "#3cd070 " }}>
                              (Subtotal: <LuIndianRupee />
                              {item.subTotal})
                            </span>
                            <p>
                              {item.balance === 0 ? (
                                ""
                              ) : (
                                <span>
                                  Balance :{" "}
                                  <span
                                    style={{
                                      color: "#e31b25",
                                      fontSize: "20px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item.balance}
                                  </span>
                                </span>
                              )}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="text-center">
                      <ul className="list-unstyled mb-0">
                        {invoice.items.map((item, index) => (
                          <li key={index}>
                            <button
                              onClick={() => handleDownload(item.pdfData)}
                              disabled={!item.pdfData}
                              className="btn invoice-download-btn btn-sm  mt-3"
                            >
                              <FaFileDownload className="fs-5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          handleDeleteService(invoice._id);
                        }}
                        className="btn invoice-download-btn btn-sm mt-3"
                      >
                        <MdDelete className="fs-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
