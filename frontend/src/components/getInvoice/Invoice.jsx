import React, { Fragment, useEffect, useRef, useState } from "react";
import AxiosInstance from "../api/AxiosInstance";
import {
  Pagination,
  Stack,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
} from "@mui/material";
import "./ProformaInvoice.css";
import { Link } from "react-router-dom";
import Logo from "../assets/logo1.webp";
import CloseIcon from "@mui/icons-material/Close";

const Invoice = () => {
      const [invoice, setInvoice] = useState([]);
      const [page, setPage] = useState(1);
      const [rowsPerPage, setRowsPerPage] = useState(5);
  const [info, setInfo] = useState([]);
  const [servicess, setServicess] = useState([]);

        useEffect(() => {
    getProfoma();
  }, []);

  const getProfoma = async () => {
    try {
      const response = await AxiosInstance.get("/invoice/get-invoice", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setInvoice(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const itemsPerPage = 5;

  const handlepageChange = (event, value) => {
    setPage(value);
  };

  const paginatedInvoice = invoice.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

//fetch details of company
   useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await AxiosInstance.get("/api/get-all-info", {
          withCredentials: true,
        });
        const servicesArray =
          response.data.length > 0 ? response.data[0].service : [];
        setServicess(servicesArray.flat());
        setInfo(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("auth");
          window.location.href = "/login";
        } else {
          console.error("Error fetching services:", error);
        }
      }
    };

    fetchServices();
  }, []);

//view details

  const invoiceRef = useRef();
  const [gstRate, setGstRate] = useState(0);
  const [term, setTerm] = useState([]);
  const [date, setDate] = useState("");
  const [showOptionalFields, setShowOptionalFields] = useState({
    gst: false,
    quantity: false,
    discount: false,
  });

  const [customerData, setCustomerData] = useState({
    clientType: "individual",
    name: "",
    phone: "",
    email: "",
    gst: "",
    pan: "",
    street: "",
    district: "",
    state: "",
    country: "India",
    pincode: "",
  });

  const [services, setServices] = useState([
    {
      id: 1,
      name: "",
      selectedService: "",
      price: 0,
      quantity: 1,
      discount: 0,
      paid: 0,
    },
  ]);

  const [invoiceNumber, setInvoiceNumber] = useState("HTM-");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };


  const searchInvoice = async (invoiceNumber) => {
    try {
      const response = await AxiosInstance.post(
        "/invoice/get-number-invoice",
        { invoiceNumber },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setOpen(true);
        const customerDetails = response.data.data.clientDetails;
        const optionFields = response.data.data.services;
        setCustomerData((prev) => ({
          ...prev,
          clientType: customerDetails.type || "individual",
          name: customerDetails.businessName || "",
          phone: customerDetails.phone || "",
          email: customerDetails.email || "",
          gst: customerDetails.gst || "",
          pan: customerDetails.pan || "",
          street: customerDetails.street || "",
          district: customerDetails.district || "",
          state: customerDetails.state || "",
          country: customerDetails.country || "India",
          pincode: customerDetails.pincode || "",
        }));

        setDate(response.data.data.date);
        setInvoiceNumber(response.data.data.invoiceNumber);

        setShowOptionalFields({
          gst: optionFields.some((s) => s.gstBoolean) || false,
          quantity: optionFields.some((s) => s.quantityBoolean) || false,
          discount: optionFields.some((s) => s.discountBoolean) || false,
        });

        const gstService = optionFields.find((s) => s.gstBoolean);
        setGstRate(gstService ? gstService.gst : 0);
        console.log(response.data.data.term, "terms");
        setTerm(response.data.data.term);
        setServices(
          optionFields.map((s) => ({
            id: s._id, // MongoDB ID
            name: s.description || "", // map serviceName → name
            selectedService: s.serviceName || "", // or use another field for dropdown
            price: s.price || 0,
            quantity: s.quantity || 1,
            discount: s.discount || 0,
            paid: s.paid || 0, // default, unless backend has it
          }))
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(term)

    const styles = {
    container: {
      margin: "0 auto",
      padding: "20px",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      padding: "24px",
      marginBottom: "24px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "16px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "16px",
    },
    gridLarge: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "16px",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      fontSize: "14px",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "4px",
      fontSize: "14px",
      backgroundColor: "white",
      boxSizing: "border-box",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#3b82f6",
      color: "white",
      padding: "10px 16px",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
    },
    buttonGreen: {
      backgroundColor: "#059669",
    },
    buttonRed: {
      backgroundColor: "transparent",
      color: "#dc2626",
      padding: "4px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      border: "1px solid #d1d5db",
    },
    th: {
      border: "1px solid #d1d5db",
      padding: "12px",
      textAlign: "left",
      fontSize: "14px",
      fontWeight: "600",
    },
    td: {
      border: "1px solid #d1d5db",
      padding: "8px",
      fontSize: "14px",
    },
    tableInput: {
      width: "100%",
      padding: "4px 8px",
      border: "1px solid #e5e7eb",
      borderRadius: "4px",
      fontSize: "14px",
    },
    invoiceHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "32px",
      flexWrap: "wrap",
      gap: "20px",
    },
    invoiceTitle: {
      fontSize: "36px",
      fontWeight: "bold",
      color: "#2563eb",
      marginBottom: "8px",
      textAlign: "center",
    },
    companyInfo: {
      textAlign: "right",
    },
    companyName: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#374151",
      marginBottom: "8px",
    },
    billToSection: {
      marginBottom: "32px",
    },
    billToCard: {
      backgroundColor: "#f9fafb",
      padding: "16px",
      borderRadius: "8px",
      marginTop: "12px",
    },
    totalsSection: {
      display: "flex",
      justifyContent: "end",
      marginBottom: "32px",
    },
    totalsCard: {
      width: "320px",
      backgroundColor: "#f9fafb",
      padding: "16px",
      borderRadius: "8px",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "4px 0",
    },
    totalRowBold: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      fontSize: "18px",
      fontWeight: "bold",
      borderTop: "2px solid #d1d5db",
      marginTop: "8px",
    },
    footer: {
      marginTop: "32px",
      paddingTop: "32px",
      borderTop: "1px solid #d1d5db",
      color: "#6b7280",
    },
    checkboxGroup: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      alignItems: "center",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "14px",
    },
    previewHeader: {
      backgroundColor: "#f3f4f6",
      padding: "16px",
    },
    previewContent: {
      padding: "32px",
      backgroundColor: "white",
    },
    previewFooter: {
      backgroundColor: "#f3f4f6",
      padding: "16px",
    },
  };

  // Calculate individual service total
  const calculateServiceTotal = (service) => {
    const quantityForCal = showOptionalFields.quantity ? service.quantity : 1;
    const baseAmount = service.price * quantityForCal;
    const discountAmount = showOptionalFields.discount
      ? (baseAmount * service.discount) / 100
      : 0;
    const subtotal = baseAmount - discountAmount;

    // Calculate GST for this service
    const gstAmount = showOptionalFields.gst ? (subtotal * gstRate) / 100 : 0;
    const totalWithGst = subtotal + gstAmount;

    return {
      subtotal,
      gstAmount,
      totalWithGst,
      baseAmount,
      discountAmount,
    };
  };

  // Calculate overall totals
  const calculateOverallTotals = () => {
    const serviceCalculations = services.map((service) =>
      calculateServiceTotal(service)
    );

    const subtotal = serviceCalculations.reduce(
      (sum, calc) => sum + calc.subtotal,
      0
    );
    const totalGstAmount = serviceCalculations.reduce(
      (sum, calc) => sum + calc.gstAmount,
      0
    );
    const cgst = totalGstAmount / 2;
    const sgst = totalGstAmount / 2;
    const total = serviceCalculations.reduce(
      (sum, calc) => sum + calc.totalWithGst,
      0
    );
    const totalPaid = services.reduce(
      (sum, service) => sum + parseFloat(service.paid || 0),
      0
    );
    const balance = total - totalPaid;

    return {
      subtotal,
      cgst,
      sgst,
      total,
      totalPaid,
      balance,
      totalGst: totalGstAmount,
      serviceCalculations,
    };
  };

  // Validate paid amount for a service
  const validatePaidAmount = (service) => {
    const serviceCalc = calculateServiceTotal(service);
    const paidAmount = parseFloat(service.paid || 0);

    if (paidAmount > serviceCalc.totalWithGst) {
      return {
        isValid: false,
        message: `Paid amount cannot exceed ₹${serviceCalc.totalWithGst.toFixed(
          2
        )}`,
      };
    }
    if (paidAmount < 0) {
      return { isValid: false, message: "Paid amount cannot be negative" };
    }
    return { isValid: true, message: "" };
  };

  // const totals = calculateTotals();
  function numberToWords(num) {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if (num === 0) return "Zero";
    if (num < 20) return a[num];
    if (num < 100)
      return b[Math.floor(num / 10)] + (num % 10 ? " " + a[num % 10] : "");
    if (num < 1000)
      return (
        a[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 ? " " + numberToWords(num % 100) : "")
      );
    if (num < 100000)
      return (
        numberToWords(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 ? " " + numberToWords(num % 1000) : "")
      );
    if (num < 10000000)
      return (
        numberToWords(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 ? " " + numberToWords(num % 100000) : "")
      );
    return num.toString();
  }

  const billedByName =
    info.length > 0 ? info[0].companyName?.trim() || "N/A" : "N/A";
  const billedByAddress = info.length > 0 ? info[0].Address || {} : {};
  const accountInfo = info.length > 0 ? info[0].accountInfo || {} : {};

  const totals = calculateOverallTotals();

  return (
       <Fragment>
      <main id="main" className="main">
        <div className="pagetitle">
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active"> Invoice</li>
            </ol>
          </nav>
        </div>

        <section className="section dashboard proforma-section">
          <div className="proforma-container">
            <h5 className="proforma-title">View  Invoice</h5>

            {/* Table or Empty State */}
            <div className="table-responsive">
              {invoice.length > 0 ? (
                <>
                  <table className="table table-hover proforma-table table-striped table-hover table-bordered">
                    <thead>
                      <tr>
                        <th
                          style={{
                            textAlign: "center",
                          }}
                        >
                          S.no
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                          }}
                        >
                          Invoice Number
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                          }}
                        >
                          Business Name
                        </th>
                        {/* <th
                          style={{
                            textAlign: "center",
                          }}
                        >
                          Service Name
                        </th> */}
                        <th
                          style={{
                            textAlign: "center",
                          }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedInvoice.map((item, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {item.invoiceNumber}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                                   {new Date(item.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {item.clientDetails.businessName}
                          </td>

                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            <button
                              className="btn btn-sm btn-primary me-2"
                             onClick={() => searchInvoice(item.invoiceNumber)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="pagination-container">
                    <Stack spacing={2}>
                      <Pagination
                        count={Math.ceil(invoice.length / itemsPerPage)}
                        page={page}
                        onChange={handlepageChange}
                        shape="rounded"
                        color="primary"
                      />
                    </Stack>
                  </div>
                </>
              ) : (
                <div className="proforma-empty">
                  <span>No  Invoice Available</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
       <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar sx={{ position: "relative", background: "#1976d2" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              View Invoice Number : {invoiceNumber}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="invoice-container">
          <div style={styles.previewHeader}>
            <h2 style={{ ...styles.title, fontSize: "18px", margin: 0 }}>
              Invoice Preview
            </h2>
          </div>

          <div ref={invoiceRef} style={styles.previewContent}>
            <div class="header mt-2">
              <div className="me-4 mt-2">
                <div className="invoice-title">
                  <h1>INVOICE </h1>
                  <div style={{ color: "#6b7280" }}>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Invoice :</strong> #{invoiceNumber}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                      <strong>Date:</strong>{" "}
                      {new Date(date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <img src={Logo} alt="Invoice Logo" className="logo-image" />
            </div>
            <div style={styles.invoiceHeader}></div>
            <section className="address-info mt-5 mb-5">
              <div className="address">
                <h6
                  className="my-4"
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "12px",
                  }}
                >
                  Billed By:
                </h6>
                <div>
                  <p
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      margin: "0 0 8px 0",
                    }}
                  >
                    <span>{billedByName}</span>
                  </p>

                  <p style={{ color: "#6b7280", margin: "7px 0" }}>
                    {" "}
                    <span style={{ color: "#e31b25", fontWeight: "bold" }}>
                      {" "}
                      Phone Number:
                    </span>{" "}
                    {info.length > 0 ? info[0].phone || "N/A" : "N/A"}
                  </p>
                  {customerData.gst && (
                    <p style={{ color: "#6b7280", margin: "7px 0" }}>
                      {" "}
                      <span style={{ color: "#e31b25", fontWeight: "bold" }}>
                        {" "}
                        GST Number:
                      </span>{" "}
                      {info.length > 0 ? info[0].phone || "N/A" : "N/A"}
                    </p>
                  )}
                  <p
                    style={{
                      color: "#6b7280",
                      margin: "8px 0 0 0",
                      display: "flex",
                    }}
                  >
                    <span style={{ color: "#e31b25", fontWeight: "bold" }}>
                      Address:
                    </span>
                    <span>
                      {billedByAddress.street || "N/A"},
                      {billedByAddress.district || "N/A"},
                      {billedByAddress.state || "N/A"},
                      {billedByAddress.country || "N/A"} -{" "}
                      {billedByAddress.pincode || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="address">
                <h6
                  className="my-4"
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "12px",
                  }}
                >
                  Billed To:
                </h6>
                <div>
                  <p
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {customerData.name ||
                      (customerData.clientType === "company"
                        ? "Company Name"
                        : "Customer Name")}
                  </p>
                  <p style={{ color: "#6b7280", margin: "7px 0" }}>
                    <span style={{ color: "#e31b25", fontWeight: "bold" }}>
                      {" "}
                      Client Type:
                    </span>{" "}
                    {customerData.clientType === "company"
                      ? "Company"
                      : "Individual"}
                  </p>
                  <p style={{ color: "#6b7280", margin: "7px 0" }}>
                    {" "}
                    <span style={{ color: "#e31b25", fontWeight: "bold" }}>
                      {" "}
                      Phone Number:
                    </span>
                    {customerData.phone || "Phone"}
                  </p>
                  {customerData.email && (
                    <p style={{ color: "#6b7280", margin: "7px 0" }}>
                      {" "}
                      <span style={{ color: "#e31b25", fontWeight: "bold" }}>
                        {" "}
                        Email:
                      </span>{" "}
                      {customerData.email || "Email"}
                    </p>
                  )}
                  {customerData.gst && (
                    <p style={{ color: "#6b7280", margin: "7px 0" }}>
                      {" "}
                      <span style={{ color: "#e31b25", fontWeight: "bold" }}>
                        {" "}
                        GST Number:
                      </span>
                      {customerData.gst}
                    </p>
                  )}
                  <p
                    style={{
                      color: "#6b7280",
                      margin: "8px 0 0 0",
                      display: "flex",
                    }}
                  >
                    <span style={{ color: "#e31b25", fontWeight: "bold" }}>
                      Address:
                    </span>
                    <span>
                      {customerData.street && `${customerData.street}, `}
                      {customerData.district && `${customerData.district}, `}
                      {customerData.state && `${customerData.state}, `}
                      {customerData.country}
                      {customerData.pincode && ` - ${customerData.pincode}`}
                    </span>
                  </p>
                </div>
              </div>
            </section>

            <div style={{ marginBottom: "32px" }}>
              <div className="address mb-3">
                <h4>
                  <strong style={{ color: "#e31b25" }}>Service</strong>
                </h4>
              </div>
              <table style={styles.table} className="tables">
                <thead>
                  <tr>
                    <th style={styles.th}>Service</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Price</th>
                    {showOptionalFields.quantity && (
                      <th style={{ ...styles.th, textAlign: "right" }}>Qty</th>
                    )}
                    {showOptionalFields.discount && (
                      <th style={{ ...styles.th, textAlign: "right" }}>
                        Discount (%)
                      </th>
                    )}{" "}
                    <th style={{ ...styles.th, textAlign: "right" }}>
                      Subtotal (₹)
                    </th>
                    {showOptionalFields.gst && (
                      <th style={{ ...styles.th, textAlign: "right" }}>
                        GST (%)
                      </th>
                    )}
                    {showOptionalFields.gst && (
                      <th style={{ ...styles.th, textAlign: "right" }}>
                        GST Amount (₹)
                      </th>
                    )}
                    <th style={{ ...styles.th, textAlign: "right" }}>
                      Total (₹)
                    </th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Paid</th>
                        <th style={{ ...styles.th, textAlign: "right" }}>
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => {
                    const serviceCalc = calculateServiceTotal(service);
                    const paidValidation = validatePaidAmount(service);
                    const balance =
                      serviceCalc.totalWithGst - parseFloat(service.paid || 0);

                    return (
                      <tr key={service.id}>
                        <td style={{ ...styles.td, textAlign: "left" }}>
                          {service.selectedService || "Service Name"}
                          <div>
                            <ul
                              style={{
                                listStyleType: "none",
                                paddingLeft: 0,
                                margin: "10px",
                              }}
                            >
                              {service.name
                                .split("\n")
                                .filter((line) => line.trim() !== "")
                                .map((value, index) => (
                                  <li key={index}>
                                    <span className="dot"></span>
                                    {value}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          ₹{service.price.toFixed(2)}
                        </td>
                        {showOptionalFields.quantity && (
                          <td style={{ ...styles.td, textAlign: "right" }}>
                            {service.quantity}
                          </td>
                        )}
                        {showOptionalFields.discount && (
                          <td style={{ ...styles.td, textAlign: "right" }}>
                            {service.discount}%
                          </td>
                        )}
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          ₹{serviceCalc.subtotal.toFixed(2)}
                        </td>
                        {showOptionalFields.gst && (
                          <td style={{ ...styles.td, textAlign: "right" }}>
                            {gstRate}%
                          </td>
                        )}

                        {showOptionalFields.gst && (
                          <td style={{ ...styles.td, textAlign: "right" }}>
                            ₹{serviceCalc.gstAmount.toFixed(2)}
                          </td>
                        )}

                        <td style={{ ...styles.td, textAlign: "right" }}>
                          ₹{serviceCalc.totalWithGst.toFixed(2)}
                        </td>
                          <td style={{ ...styles.td, textAlign: "right" }}>
                          ₹{service.paid.toFixed(2)}
                        </td>
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          ₹{balance.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={styles.totalsSection}>
              <div style={styles.totalsCard}>
                <div style={styles.totalRow}>
                  <span>Subtotal:</span>
                  <span>₹{totals.subtotal.toFixed(2)}</span>
                </div>
                {showOptionalFields.gst && (
                  <>
                    <div style={styles.totalRow}>
                      <span>CGST ({(gstRate / 2).toFixed(2)}%):</span>
                      <span>₹{totals.cgst.toFixed(2)}</span>
                    </div>
                    <div style={styles.totalRow}>
                      <span>SGST ({(gstRate / 2).toFixed(2)}%):</span>
                      <span>₹{totals.sgst.toFixed(2)}</span>
                    </div>
                  </>
                )}

                <div style={styles.totalRowBold}>
                  <span>Total:</span>
                  <span>₹{totals.total.toFixed(2)}</span>
                </div>
                 <div style={{ ...styles.totalRow, color: "#059669" }}>
                    <span>Total Paid:</span>
                    <span>₹{totals.totalPaid.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      ...styles.totalRow,
                      color: "#dc2626",
                      fontWeight: "600",
                    }}
                  >
                    <span>Balance Due:</span>
                    <span>₹{totals.balance.toFixed(2)}</span>
                  </div>
              </div>
            </div>
            <div
              style={{
                textAlign: "end",
              }}
            >
              <span className="price-display">
                ₹{totals.total}
                <span className="price-in-words">
                  ({numberToWords(Math.floor(totals.total))} Rupees Only)
                </span>
              </span>
            </div>

            <div className="bank-info-container my-5" style={styles.footer}>
              <h5 className="mb-3 ">
                <strong className="text-danger">Payment Info:</strong>
              </h5>
              <p className="mt-2">
                <span>Account Name:</span> {accountInfo.accountName || "N/A"}
              </p>
              <p className="mt-2">
                <span>Account No:</span> {accountInfo.accountNumber || "N/A"}
              </p>
              <p className="mt-2">
                <span>IFSC Code:</span> {accountInfo.ifceCode || "N/A"}
              </p>
              <p className="mt-2">
                <span>Bank:</span> {accountInfo.bankName || "N/A"}
              </p>
              <p className="mt-2">
                <span>Account Type:</span> {"Current"}
              </p>
              <p className="mt-2">
                <span>GST:</span> {accountInfo.accountType || "N/A"}
              </p>
              <p className="mt-2">
                <span>G-pay Number:</span> {accountInfo.gpay || "N/A"}
              </p>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
              <h5 className="mb-3 ">
                <strong className="text-danger">Terms and Condition:</strong>
              </h5>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {term?.length ? (
                  term.map((terms, index) => (
                    <li
                      key={index}
                      style={{
                        marginTop: "10px",
                        marginLeft: "20px",
                      }}
                    >
                      <span className="dot"></span>
                      {terms}
                    </li>
                  ))
                ) : (
                  <li>N/A</li>
                )}
              </ul>
            </div>
          </div>

          {/* <div style={styles.previewFooter}>
                  <button
                    onClick={handleDownload}
                    style={{ ...styles.button, ...styles.buttonGreen }}
                  >
                    Save PDF
                  </button>
                </div> */}
        </div>
      </Dialog>
      </Fragment>
  )
}

export default Invoice