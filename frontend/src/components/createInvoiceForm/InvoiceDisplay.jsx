import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./InvoiceDisplay.css";
import Logo from "../assets/logo1.webp";

const InvoiceDisplay = ({ info, invoiceData }) => {
  const invoiceRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);

    const element = invoiceRef.current;

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
      setIsDownloading(false);
      window.location.reload();
    });
  };

  const {
    items = [],
    clientName = "N/A",
    clientEmail = "N/A",
    phone = "N/A",
    Address = {},
    date = "N/A",
    invoiceNumber = "N/A",
  } = invoiceData;

  // Calculate total dynamically
  const total = items.reduce((acc, item) => {
    return acc + (item.price * item.quantity || 0);
  }, 0);

  const billedByName =
    info.length > 0 ? info[0].companyName?.trim() || "N/A" : "N/A";
  const billedByAddress = info.length > 0 ? info[0].Address || {} : {};
  const accountInfo = info.length > 0 ? info[0].accountInfo || {} : {};

  return (
    <>
      <div className="invoice-container" ref={invoiceRef}>
        <img src={Logo} alt="Invoice Image " class="logo" />
        <div class="header mt-2">
          <img src={Logo} alt="Invoice Logo" className="logo-image" />

          <div className="me-4 mt-2">
            <div className="invoice-title">
              <h1>INVOICE</h1>
              <h6>{invoiceData.date}</h6>
            </div>
          </div>
        </div>

        <section className="main-invoice-content">
          <span className="service-container text-uppercase ">
            {items.map((item) => (
              <span key={item.description}>{item.description}</span>
            ))}
          </span>

          <h6 className="invoice-number mt-1">
            Invoice No:{" "}
            <span className="invoice-number-highlight  fw-bold">
              #{invoiceData.invoiceNumber}
            </span>
          </h6>

          <section className="address-info mt-5">
            <div className="address">
              <h6 className="my-4">Billed By:</h6>
              <h4>
                <strong style={{ color: "#e31b25" }}>{billedByName}</strong>
              </h4>
              <p>{billedByAddress.street || "N/A"}</p>
              <p>
                {billedByAddress.district || "N/A"},
                {billedByAddress.state || "N/A"},
                {billedByAddress.country || "N/A"} -{" "}
                {billedByAddress.pincode || "N/A"}
              </p>
              <p>Phone: {info.length > 0 ? info[0].phone || "N/A" : "N/A"}</p>
            </div>
            <div className="address">
              <h6 className="my-4">Billed To:</h6>
              <h4>
                <strong style={{ color: "#e31b25" }}>{clientName}</strong>
              </h4>
              <p>{clientEmail}</p>
              <p>{Address.street || "N/A"}</p>
              <p>
                {Address.district || "N/A"},{Address.state || "N/A"},
                {Address.country || "N/A"} - {Address.pincode || "N/A"}
              </p>
              <p>Phone: {phone}</p>
            </div>
          </section>

          <section className="table-container mt-5">
            <table>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e31b25",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  <th>SERVICE</th>
                  <th>PRICE</th>
                  <th>QTY</th>
                  <th>GST(%)</th>
                  <th>PAID</th>
                  <th>BALANCE</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description || "N/A"}</td>
                    <td>{item.price || 0}</td>
                    <td>{item.quantity || 0}</td>
                    <td>{item.gst || "NILL"}</td>
                    <td>{item.paid}</td>
                    <td>{item.balance || "NILL"}</td>
                    <td>{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "#ffdfe0", color: "#ff2f2f" }}>
                  <td
                    colSpan="6"
                    style={{ textAlign: "right", fontSize: "20px" }}
                  >
                    Total (INR)
                  </td>
                  <td style={{ fontSize: "20px" }}>{total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <div className="bank-info-container my-5">
            <h5 className="mb-3 ">
              <strong className="text-danger">Payment Info:</strong>
            </h5>
            <p>
              <span>Account Name:</span> {accountInfo.accountName || "N/A"}
            </p>
            <p>
              <span>Account No:</span> {accountInfo.accountNumber || "N/A"}
            </p>
            <p>
              <span>IFSC Code:</span> {accountInfo.ifceCode || "N/A"}
            </p>
            <p>
              <span>Bank:</span> {accountInfo.bankName || "N/A"}
            </p>
            <p>
              <span>Account Type:</span> {"Current"}
            </p>
            <p>
              <span>GST:</span> {accountInfo.accountType || "N/A"}
            </p>
            <p>
              <span>G-pay Number:</span> {accountInfo.gpay || "N/A"}
            </p>
          </div>
        </section>

        <footer style={{ backgroundColor: "#fffbfb" }}>
          <h6 style={{ color: "#e31b25" }}>Terms and Conditions</h6>
          <ul style={{ listStyleType: "number" }}>
            {(info.length > 0 &&
              info[0].TermsAndCondition?.map((term, index) => (
                <li key={index}>{term}</li>
              ))) || <li>N/A</li>}
          </ul>
        </footer>
      </div>
      <button
        onClick={handleDownload}
        style={{ display: "block", margin: "20px auto" }}
        className={`btn btn-primary ${isDownloading ? "hidden" : ""}`}
      >
        Download PDF
      </button>
    </>
  );
};

export default InvoiceDisplay;
