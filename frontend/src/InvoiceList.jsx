import React, { useEffect, useState } from "react";
import axiosInstance from "./components/api/AxiosInstance";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Fetch invoices from the backend
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/get-all-invoices"
        );
        setInvoices(response.data); // Use response.data directly
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchInvoices();
  }, []);

  const handleDownload = (url) => {
    // Check if URL is valid
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("No valid URL available for download.");
    }
  };

  return (
    <div>
      <h1>Invoice List</h1>
      <table>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Client Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Items</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No invoices available.
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td>{invoice.clientName}</td>
                <td>{invoice.clientEmail}</td>
                <td>{invoice.phone}</td>
                <td>
                  {invoice.Address.street}, {invoice.Address.district},{" "}
                  {invoice.Address.state}, {invoice.Address.country},{" "}
                  {invoice.Address.pincode}
                </td>
                <td>
                  <ul>
                    {invoice.items.map((item, index) => (
                      <li key={index}>
                        {item.description} - ${item.price} x {item.quantity}{" "}
                        (Subtotal: ${item.subTotal})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {invoice.items.map((item, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleDownload(item.pdfData)}
                          disabled={!item.pdfData}
                          style={{ marginLeft: "10px" }}
                        >
                          Download {`Item ${index + 1}`}
                        </button>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
