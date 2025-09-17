import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../assets/logo1.webp";
import "./InvoiceDisplay.css";
import AxiosInstance from "../api/AxiosInstance";
import { TextField, Button, Box } from "@mui/material";
import { FormLabel } from "@mui/material";

const CreateInvoiceFronetEndPdf = () => {
  const [servicess, setServicess] = useState([]);
 // const [, setSelectedService] = useState("");
  const [term, setTerm] = useState([{ value: "", error: "" }]);
  const [info, setInfo] = useState([]);
  const [invoiceType, setInvoiceType] = useState("invoice");
  const [gstRate, setGstRate] = useState(0);
  const [date, setDate] = useState();
  const [invoiceNumber, setInvoiceNumber] = useState("HTM-");
  const [showOptionalFields, setShowOptionalFields] = useState({
    gst: false,
    quantity: false,
    discount: false,
  });

  const [error, setError] = useState({
    clientType: "",
    name: "",
    phone: "",
    email: "",
    gst: "",
    pan: "",
    street: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
   

  });

    // Error states for validation
  const [priceError, setPriceError] = useState({});
  const [discountError, setDiscountError] = useState({});
  const [gstError, setGstError] = useState('');

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
      selectedService:"",
      price: 0,
      quantity: 1,
      discount: 0,
      paid: 0,
    },
  ]);

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

  const handleTermChange = (index, e) => {
    const { value } = e.target;
    const newTerm = [...term];
    newTerm[index].value = value;

    if (value.length < 10) {
      newTerm[index].error =
        "Terms & condition must be at least 10 characters.";
    } else {
      newTerm[index].error = "";
    }

    setTerm(newTerm);
  };

  const handleTermBlur = (index, e) => {
    const { value } = e.target;
    const newTerm = [...term];
    if (value === "") {
      newTerm[index].error = "Terms & condition is required.";
    }
    setTerm(newTerm);
  };

  const addTermField = () => {
    if (term.length >= 10) {
      alert("Maximum of 10 Terms & condition can be added.");
      return;
    }

    const lastField = term[term.length - 1];
    if (lastField.value === "") {
      alert("Complete the current field.");
    } else if (lastField.error) {
      alert("Fix the error in Terms & condition");
    } else {
      setTerm([...term, { value: "", error: "" }]);
    }
  };

  const deleteTermField = (index) => {
    if (term.length <= 1) {
      alert("At least one Terms & condition must remain.");
      return;
    }

    const newTerm = [...term];
    newTerm.splice(index, 1);
    setTerm(newTerm);
  };

  const invoiceRef = useRef();

  const addService = () => {
    const newService = {
      id: Date.now(),
      selectedService:"",
      name: "",
      price: 0,
      quantity: 1,
      discount: 0,
      paid: 0,
    };
    setServices([...services, newService]);
  };

  const removeService = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const updateService = (id, field, value) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const updateCustomer = (field, value) => {
    setCustomerData({ ...customerData, [field]: value });
  };

  // const calculateServiceTotal = (service) => {
  //   const quantityForCal = showOptionalFields.quantity ? service.quantity : 1;
  //   const baseAmount = service.price * quantityForCal;
  //   const discountAmount = showOptionalFields.discount
  //     ? (baseAmount * service.discount) / 100
  //     : 0;
  //   return baseAmount - discountAmount;
  // };

  // console.log(services);

  // const calculateTotals = () => {
  //   const subtotal = services.reduce(
  //     (sum, service) => sum + calculateServiceTotal(service),
  //     0
  //   );
  //   const cgst = showOptionalFields.gst ? (subtotal * gstRate) / 200 : 0; // Half of GST rate
  //   const sgst = showOptionalFields.gst ? cgst : 0; // Same as CGST
  //   const total = subtotal + cgst + sgst;
  //   const totalGst = cgst + sgst;
  //   const totalPaid = services.reduce(
  //     (sum, service) => sum + parseFloat(service.paid || 0),
  //     0
  //   );
  //   const balance = total - totalPaid;

  //   return { subtotal, cgst, sgst, total, totalPaid, balance, totalGst };
  // };

  const generateProformaNumber = () => {
    return `HTM-${Date.now().toString().slice(-6)}`;
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

  console.log(date)

const validateThePdf = () => {

  if(date===undefined){
     alert(`❌ Date is required`);
      return false;
  }
  // ✅ Validate customerData
  const requiredFields = [
    "clientType",
    "name",
    "phone",
    "street",
    "district",
    "state",
    "country",
    "pincode",
  ];

  for (let field of requiredFields) {
    if (!customerData[field] || customerData[field].toString().trim() === "") {
      alert(`❌ ${field} is required`);
      return false;
    }
  }

  // ✅ Optional email validation (if provided)
  if (customerData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
    alert("❌ Invalid email address");
    return false;
  }

  // ✅ Optional GST validation (if provided)
  if (
    customerData.gst &&
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      customerData.gst
    )
  ) {
    alert("❌ Invalid GST number");
    return false;
  }

  // ✅ Optional PAN validation (if provided)
  if (
    customerData.pan &&
    !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(customerData.pan)
  ) {
    alert("❌ Invalid PAN number");
    return false;
  }

  // ✅ Validate services
  if (!services || services.length === 0) {
    alert("❌ At least one service is required");
    return false;
  }

  for (let s of services) {
    if(!s.selectedService){
      alert("❌ Service name is required");
      return false;
    }
    if (!s.name || s.name.trim() === "") {
      alert("❌ Service Description is required");
      return false;
    }


    if (s.price <= 0) {
      alert(`❌ Price must be greater than 0 for service: ${s.selectedService || "Unnamed"}`);
      return false;
    }

    if (showOptionalFields.gst && (!gstRate|| gstRate <= 0)) {
      alert(`❌ GST must be greater than 0 for service: ${s.selectedService || "Unnamed"}`);
      return false;
    }

    if (showOptionalFields.quantity && (!s.quantity || s.quantity <= 0)) {
      alert(`❌ Quantity must be greater than 0 for service: ${s.selectedService || "Unnamed"}`);
      return false;
    }

    if (showOptionalFields.discount && (!s.discount || s.discount <= 0)) {
      alert(`❌ Discount must be greater than 0 for service: ${s.selectedService || "Unnamed"}`);
      return false;
    }
  }

  if (!term || term.length === 0) {
    alert("❌ At least one term is required");
    return false;
  }

  for(let t of term){
    if(t.value ===""){
       alert("❌ At term is required");
          return false;
    }

    if(t.error !==""){
      alert("❌ check the term error");
          return false;
    }
  }

  return true;
};

 const handleSubmit=async()=>{
    if(invoiceType==="proforma"){
        if(!validateThePdf()){
          return false;
        }

        try{

          const response=await AxiosInstance.post("/proforma/post-invoice",
            {
              invoiceNumber:invoiceNumber,
              date:date,
              customerDetails:{
                type:customerData.clientType,
                businessName:customerData.name,
                phone:customerData.phone,
                email:customerData.email,
                gst:customerData.gst,
                pan:customerData.pan,
                street:customerData.street,
                district:customerData.district,
                state:customerData.state,
                country:customerData.country,
                pincode:customerData.pincode
              },
              services:services.map((value,index)=>{
                 return {
                  serviceName:value.selectedService,
                  description:value.name,
                  price:value.price,
                  gstBoolean:showOptionalFields.gst,
discountBoolean:showOptionalFields.discount,
quantityBoolean:showOptionalFields.quantity,
quantity:value.quantity,
gst:gstRate,
discount:value.discount

                 }
              }),
              term:term.map((value)=> value.value)

            }

          )

          if(response.status===200){
            alert("Sucessully profoma invoice data stored")
             handleDownload()
          }

        }catch(err){
          console.log(err)
        }

       
    }else{
       if(!validateThePdf()){
          return false;
        }

          handleDownload()
    }

 }

  const handleDownload = () => {


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

      pdf.save(`Invoice_${invoiceNumber}.pdf`);
      window.location.reload();
    });
  };

  const billedByName =
    info.length > 0 ? info[0].companyName?.trim() || "N/A" : "N/A";
  const billedByAddress = info.length > 0 ? info[0].Address || {} : {};
  const accountInfo = info.length > 0 ? info[0].accountInfo || {} : {};

  const errMessage = (fieldName, fieldValue) => {
    let message = "";

    if (fieldName) {
      if (fieldValue === "") {
        message = "";
      }
    }

    if (fieldName === "name") {
      const alphaRegex =  /^[A-Za-z0-9\s.,&_#/-]+$/;
     if(fieldValue===""){
      message=""
    } else   if (!alphaRegex.test(fieldValue)) {
        message = "Business Name must contain only alphabets";
      } else if (fieldValue.length < 3) {
        message = "Business Name is Invalid";
      } else {
        message = "";
      }
    }

    if (fieldName === "email") {
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]{2,}@[a-zA-Z-]+\.[a-zA-Z-]{2,}$/;
    if(fieldValue===""){
      message=""
    } else if (!emailRegex.test(fieldValue)) {
        message = "Email is Invalid";
      } else {
        message = "";
      }
    }

    if (fieldName === "phone") {
      const numericRegex = /^[0-9]+$/;
      const numericValue = fieldValue.replace(/[^0-9]/g, "");
      if(fieldValue===""){
      message=""
    } else  if (!numericRegex.test(fieldValue)) {
        message = "Phone must contain only numbers";
      } else if (numericValue.length < 10) {
        message = "Phone number needs 10 digits";
      } else if (numericValue.length > 10) {
        message = "Phone number is too long";
      } else {
        const prefix = parseInt(numericValue.slice(0, 2), 10);
        if (!(prefix >= 63 && prefix <= 99)) {
          message = "Invalid Phone Number";
        }
      }
    }

    if (["country", "district", "state"].includes(fieldName)) {
      const alphaRegex = /^[A-Za-z\s]+$/;
      if(fieldValue===""){
      message=""
    } else  if (!alphaRegex.test(fieldValue)) {
        message = `${capitalizeFirstLetter(
          fieldName
        )} must contain only alphabets`;
      } else if (fieldValue.length < 3) {
        message = `${capitalizeFirstLetter(fieldName)} is invalid`;
      } else {
        message = "";
      }
    }

    if (fieldName === "street") {
      const streetRegex = /^[A-Za-z0-9\s.,#/-]+$/;
     if(fieldValue===""){
      message=""
    } else   if (!streetRegex.test(fieldValue)) {
        message = "Street can only contain letters, numbers, and symbols";
      } else if (fieldValue.length < 3) {
        message = "Street is invalid";
      } else {
        message = "";
      }
    }

    if (fieldName === "pincode") {
      const numericRegex = /^[0-9]+$/;
      if(fieldValue===""){
      message=""
    } else  if (!numericRegex.test(fieldValue)) {
        message = "Pincode must contain only numbers";
      } else if (fieldValue.length < 6) {
        message = "Pincode must need 6 digits";
      } else if (fieldValue.length > 6) {
        message = "Pincode is too long";
      } else {
        message = "";
      }
    }

    if (fieldName === "gst") {
      const alnumRegex = /^[A-Za-z0-9]+$/;
     if(fieldValue===""){
      message=""
    } else   if (!alnumRegex.test(fieldValue)) {
        message = "GST number must contain only alphabets and numbers";
      } else if (fieldValue.length < 15) {
        message = "GST number must be 15 characters";
      } else if (fieldValue.length > 15) {
        message = "GST number is too long";
      } else {
        message = "";
      }
    }

    if (fieldName === "pan") {
      const alnumRegex = /^[A-Za-z0-9]+$/;
      if(fieldValue===""){
      message=""
    } else  if (!alnumRegex.test(fieldValue)) {
        message = "PAN number must contain only alphabets and numbers";
      } else if (fieldValue.length < 10) {
        message = "PAN number must be 10 characters";
      } else if (fieldValue.length > 10) {
        message = "PAN number is too long";
      } else {
        message = "";
      }
    }

    return { message: message };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const err = errMessage(name, value).message;
    setError((pre) => {
      return {
        ...pre,
        [name]: err,
      };
    });

    setCustomerData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setError((prevState) => ({
        ...prevState,
        [name]: `${capitalizeFirstLetter(name)} field is required`,
      }));
    }
  };

  const handleDown = (e) => {
    if (e.key === " " && e.target.selectionStart === 0) {
      e.preventDefault();
    }
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
      discountAmount
    };
  };

  // Calculate overall totals
  const calculateOverallTotals = () => {
    const serviceCalculations = services.map(service => calculateServiceTotal(service));
    
    const subtotal = serviceCalculations.reduce((sum, calc) => sum + calc.subtotal, 0);
    const totalGstAmount = serviceCalculations.reduce((sum, calc) => sum + calc.gstAmount, 0);
    const cgst = totalGstAmount / 2;
    const sgst = totalGstAmount / 2;
    const total = serviceCalculations.reduce((sum, calc) => sum + calc.totalWithGst, 0);
    const totalPaid = services.reduce((sum, service) => sum + parseFloat(service.paid || 0), 0);
    const balance = total - totalPaid;

    return { 
      subtotal, 
      cgst, 
      sgst, 
      total, 
      totalPaid, 
      balance, 
      totalGst: totalGstAmount,
      serviceCalculations 
    };
  };

  // Validate paid amount for a service
  const validatePaidAmount = (service) => {
    const serviceCalc = calculateServiceTotal(service);
    const paidAmount = parseFloat(service.paid || 0);
    
    if (paidAmount > serviceCalc.totalWithGst) {
      return { isValid: false, message: `Paid amount cannot exceed ₹${serviceCalc.totalWithGst.toFixed(2)}` };
    }
    if (paidAmount < 0) {
      return { isValid: false, message: 'Paid amount cannot be negative' };
    }
    return { isValid: true, message: '' };
  };


    // Validation helper function
 const validateNumberInput = (value) => {
  // Allow empty string
 
  
   const numericRegex = /^[0-9]+$/;
      const numericValue = value.replace(/[^0-9]/g, "");

     if(value===""){
    return true
    } else  if (!numericRegex.test(value)) {
        return false
      } else{
        return true
      }
  
  return true;
};

  // Handle price change with validation
  const handlePriceChange = (e, serviceId) => {
    const value = e.target.value;
 console.log(value)
    console.log(validateNumberInput(value))
    if (validateNumberInput(value)) {
      updateService(serviceId, 'price', parseFloat(value) || 0);
      setPriceError(prev => ({ ...prev, [serviceId]: '' }));
    } else {
      setPriceError(prev => ({
        ...prev,
        [serviceId]: 'Invalid price: only numbers allowed, no leading zeros.'
      }));
    }
  };

  // Handle discount change with validation
  const handleDiscountChange = (e, serviceId) => {
    const value = e.target.value;
    console.log(value)
    console.log(validateNumberInput(value))
    if (validateNumberInput(value)) {
      const numValue = parseFloat(value) || 0;
      if (numValue < 100) {
        updateService(serviceId, 'discount', numValue);
        setDiscountError(prev => ({ ...prev, [serviceId]: '' }));
      } else {
        setDiscountError(prev => ({
          ...prev,
          [serviceId]: 'Discount cannot exceed 100%'
        }));
      }
    } else {
      setDiscountError(prev => ({
        ...prev,
        [serviceId]: 'Invalid discount: only numbers allowed, no leading zeros.'
      }));
    }
  };

  // Handle GST rate change with validation
  const handleGstRateChange = (e) => {
    const value = e.target.value;

    if (validateNumberInput(value)) {
      const numValue = parseFloat(value) || 0;
      if (numValue <= 100) {
        setGstRate(numValue);
        setGstError('');
      } else {
        setGstError('GST rate cannot exceed 100%');
      }
    } else {
      setGstError('Invalid GST rate: only numbers allowed, no leading zeros.');
    }
  };


 const searchInvoice=async()=>{
  try{

     const response = await AxiosInstance.post("/proforma/get-invoice",{invoiceNumber},{withCredentials:true})

     if(response.status===200){
        console.log(response.data)
        const customerDetails=response.data.data.clientDetails
        const optionFields=response.data.data.services
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

console.log(optionFields)

setShowOptionalFields({
  gst: optionFields.some((s) => s.gstBoolean) || false,
  quantity: optionFields.some((s) => s.quantityBoolean) || false,
  discount: optionFields.some((s) => s.discountBoolean) || false,
});

const gstService = optionFields.find((s) => s.gstBoolean);
setGstRate(gstService ? gstService.gst : 0);

setServices(
  optionFields.map((s) => ({
    id: s._id,                         // MongoDB ID
    name: s.description || "",         // map serviceName → name
    selectedService: s.serviceName || "", // or use another field for dropdown
    price: s.price || 0,
    quantity: s.quantity || 1,
    discount: s.discount || 0,
    paid: 0, // default, unless backend has it
  }))
);
     }
  }catch(err){
    console.log(err)
  }
  }

  console.log(showOptionalFields)
  const totals = calculateOverallTotals();
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Invoice Generator</h1>

        <div style={styles.grid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Invoice Type</label>
            <select
              value={invoiceType}
              onChange={(e) =>{
               setInvoiceNumber(generateProformaNumber()) 
                setInvoiceType(e.target.value)
                setCustomerData({
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
                })
                setShowOptionalFields({
                  gst:false,
                  discount:false,
                  quantity:false
                })
                setTerm([{
                  value:"",
                  error:""
                }])
                setInvoiceNumber("HTM-")
                setServices([{
                   id: 1,
      name: "",
      selectedService:"",
      price: 0,
      quantity: 1,
      discount: 0,
      paid: 0,
                }])
              } }

           
              style={styles.select}
            >
              <option value="invoice">Invoice</option>
              <option value="proforma">Proforma Invoice</option>
            </select>
          </div>

          <div className="date-selector">
            <label style={styles.label}>select date :</label>
            <input
              type="date"
              id="date-selector"
              style={styles.input}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {invoiceType === "invoice" && (
            <>
            <div style={styles.formGroup}>
              <label style={styles.label}>Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                style={styles.input}
                placeholder="HTM-123445"
                maxLength={10}
              />
            </div>
          
              </>
          )}
        </div>
        {invoiceType === "invoice" &&
            <div>
              <button onClick={searchInvoice} style={styles.button}>
                Search Invoice
              </button>
              </div>
        }
      </div>

      <div style={styles.card}>
        <h2 style={{ ...styles.title, fontSize: "18px" }}>Customer Details</h2>

        <div style={styles.gridLarge}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Client Type</label>
            <select
              value={customerData.clientType}
              onChange={(e) => updateCustomer("clientType", e.target.value)}
              style={styles.select}
              onBlur={handleBlur}
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
            </select>
            {error.clientType && (
              <p className="error-message">{error.clientType}</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Business Name *</label>
            <input
              type="text"
              placeholder="Business Name"
              name="name"
              value={customerData.name}
              onChange={handleChange}
              style={styles.input}
              onBlur={handleBlur}
              maxLength={20}
            />
            {error.name && <p className="error-message">{error.name}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone *</label>
            <input
              type="tel"
              placeholder="Phone"
              name="phone"
              value={customerData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              style={styles.input}
              maxLength={10}
              onKeyDown={(e) => {
                handleDown(e);
              }}
            />

            {error.phone && <p className="error-message">{error.phone}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={customerData.email}
              onChange={handleChange}
              style={styles.input}
              onKeyDown={(e) => {
                handleDown(e);
              }}
            />
            {error.email && <p className="error-message">{error.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>GST Number</label>
            <input
              type="text"
              name="gst"
              placeholder="GST Number"
              value={customerData.gst}
              onChange={handleChange}
              style={styles.input}
              maxLength={15}
              onKeyDown={(e) => {
                handleDown(e);
              }}
            />
            {error.gst && <p className="error-message">{error.gst}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>PAN (Optional)</label>
            <input
              type="text"
              placeholder="PAN"
              name="pan"
              maxLength={10}
              value={customerData.pan}
              onChange={handleChange}
              style={styles.input}
              onKeyDown={(e) => {
                handleDown(e);
              }}
            />
            {error.pan && <p className="error-message">{error.pan}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Street Address *</label>
            <input
              type="text"
              placeholder="Street Address"
              name="street"
              maxLength={30}
              value={customerData.street}
              onBlur={handleBlur}
              onChange={handleChange}
              style={styles.input}
              onKeyDown={(e) => {
                handleDown(e);
              }}
            />
            {error.street && <p className="error-message">{error.street}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>District *</label>
            <input
              type="text"
              placeholder="District"
              name="district"
              maxLength={20}
              value={customerData.district}
              onBlur={handleBlur}
              onChange={handleChange}
              style={styles.input}
              onKeyDown={(e) => {
                handleDown(e);
              }}
            />
            {error.district && (
              <p className="error-message">{error.district}</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>State *</label>
            <input
              type="text"
              placeholder="State"
              name="state"
              maxLength={20}
              value={customerData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              style={styles.input}
              onKeyDown={(e) => {
                handleDown(e);
              }}
            />
            {error.state && <p className="error-message">{error.state}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Country *</label>
            <input
              type="text"
              name="country"
              maxLength={20}
              placeholder="Country"
              value={customerData.country}
              onChange={handleChange}
              onBlur={handleBlur}
              style={styles.input}
              onKeyDown={(e) => {
                handleDown(e);
              }}
            />
            {error.country && <p className="error-message">{error.country}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Pincode *</label>
            <input
              type="text"
              placeholder="Pincode"
              name="pincode"
              maxLength={6}
              value={customerData.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
              style={styles.input}
              onKeyDown={(e) => {
                handleDown(e);
              }}
            />
            {error.pincode && <p className="error-message">{error.pincode}</p>}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ ...styles.title, fontSize: "18px", margin: 0 }}>
            Services
          </h2>

          <button onClick={addService} style={styles.button}>
            <Plus size={16} />
            Add Service
          </button>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Optional Fields</label>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showOptionalFields.gst}
                onChange={(e) =>
                  setShowOptionalFields({
                    ...showOptionalFields,
                    gst: e.target.checked,
                  })
                }
              />
              GST
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showOptionalFields.quantity}
                onChange={(e) =>
                  setShowOptionalFields({
                    ...showOptionalFields,
                    quantity: e.target.checked,
                  })
                }
              />
              Quantity
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showOptionalFields.discount}
                onChange={(e) =>
                  setShowOptionalFields({
                    ...showOptionalFields,
                    discount: e.target.checked,
                  })
                }
              />
              Discount
            </label>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Service Name</th>
                <th style={styles.th}>Price</th>
                {showOptionalFields.quantity && (
                  <th style={styles.th}>Quantity</th>
                )}
                {showOptionalFields.discount && (
                  <th style={styles.th}>Discount (%)</th>
                )}
                  <th style={styles.th}>Subtotal (₹)</th>
                 {showOptionalFields.gst && <th style={styles.th}>GST (%)</th>}
              
              {showOptionalFields.gst && <th style={styles.th}>GST Amount (₹)</th>}
              <th style={styles.th}>Total (₹)</th>
                {invoiceType === "invoice" && <th style={styles.th}>Paid</th>}
                {invoiceType === "invoice" && (
                  <th style={styles.th}>Balance</th>
                )}

                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => {
                const serviceCalc  = calculateServiceTotal(service);
              const paidValidation = validatePaidAmount(service);
              const balance = serviceCalc.totalWithGst - parseFloat(service.paid || 0);

                return (
                  <tr key={service.id}>
                    <td style={styles.td}>
                      <div>
                        <select
                          name="service"
                          className="form-control"
                          required
                          value={service.selectedService}
                          onChange={(e) =>
                            updateService(service.id, "selectedService", e.target.value)
                          }
                        >
                          <option value="">Select a service</option>
                          {servicess?.map((service, index) => (
                            <option key={index} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2">
                        <textarea
                          rows="4"
                          cols="50"
                          type="text"
                          value={service.name}
                          multiple
                          onChange={(e) =>
                            updateService(service.id, "name", e.target.value)
                          }
                          style={styles.tableInput}
                          placeholder="Service name"
                        />
                      </div>
                    </td>
                    <td style={styles.td}>
                      <input
                        type="text"
                        value={service.price}
                         onChange={(e) => handlePriceChange(e, service.id)}
                        style={styles.tableInput}
                        placeholder="0"
                        onKeyDown={(e) => {
                          handleDown(e)
                         }}
                         maxLength={6}
                      />
                       {priceError[service.id] && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {priceError[service.id]}
                </div>
              )}
                    </td>
                    {showOptionalFields.quantity && (
                      <td style={styles.td}>
                        <input
                          type="number"
                          value={service.quantity}
                          onChange={(e) =>
                            updateService(
                              service.id,
                              "quantity",
                              showOptionalFields.quantity === true
                                ? parseFloat(e.target.value) || 1
                                : 0
                            )
                          }
                          style={styles.tableInput}
                          onKeyDown={(e) => {
                            const allowedKeys = [
                              "Backspace",
                              "ArrowLeft",
                              "ArrowRight",
                              "Delete",
                              "Tab",
                            ];
                            const allowedCharPattern = /^[0-9]$/;

                            if (
                              !allowedKeys.includes(e.key) &&
                              !allowedCharPattern.test(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          min="1"
                        />
                      </td>
                    )}
                    {showOptionalFields.discount && (
                      <td style={styles.td}>
                        <input
                          type="text"
                          value={service.discount}
                          maxLength={2}
                          onChange={(e) => handleDiscountChange(e, service.id)}
                          style={styles.tableInput}
                          placeholder="0"
                         
                         
                       onKeyDown={(e) => {
                           handleDown(e)
                          }}
                        />
                          {discountError[service.id] && (
                        <div style={{ color: "red", fontSize: "12px" }}>{discountError[service.id]}</div>
                      )}
                      </td>
                    )}
                      <td style={{ ...styles.td, textAlign: "right", fontWeight: 'bold' }}>
                    ₹{serviceCalc.subtotal.toFixed(2)}
                  </td>
                    {showOptionalFields.gst && (
                      <td style={styles.td}>
                        <input
                          type="text"
                          value={gstRate}
                          maxLength={2}
                          onChange={(e) =>
                           handleGstRateChange(e)
                          }
                          style={styles.input}
                          onKeyDown={(e) => {
                           handleDown(e)
                          }}
                        />
                         {gstError && (
                        <div style={{ color: "red", fontSize: "12px" }}>{gstError}</div>
                      )}
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
                    {invoiceType === "invoice" && (
                      <td style={styles.td}>
                        <input
                          type="text"
                          value={service.paid}
                          onChange={(e) =>
                            updateService(
                              service.id,
                              "paid",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          style={styles.tableInput}
                          placeholder="0"
                          onKeyDown={(e) => {
                            const allowedKeys = [
                              "Backspace",
                              "ArrowLeft",
                              "ArrowRight",
                              "Delete",
                              "Tab",
                            ];
                            const allowedCharPattern = /^[0-9]$/;

                            if (
                              !allowedKeys.includes(e.key) &&
                              !allowedCharPattern.test(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                          {!paidValidation.isValid && (
                        <div className="error-message">{paidValidation.message}</div>
                      )}
                      </td>
                    )}
                    {invoiceType === "invoice" && (
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        ₹{balance.toFixed(2)}
                      </td>
                    )}

                    <td style={styles.td}>
                      <button
                        onClick={() => removeService(service.id)}
                        style={styles.buttonRed}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={{ ...styles.title, fontSize: "18px" }}>
          Term and Condition
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h5 style={{ textAlign: "center" }}></h5>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Button variant="contained" color="success" onClick={addTermField}>
              Add
            </Button>
          </Box>
        </div>

        {term.map((field, index) => (
          <Box
            key={index}
            sx={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              label={`Term & condition ${index + 1}`}
              fullWidth
              variant="outlined"
              slotProps={{
                htmlInput: {
                  maxLength: 200,
                },
              }}
              rows={2}
              multiline
              value={field.value}
              onChange={(e) => handleTermChange(index, e)}
              onBlur={(e) => handleTermBlur(index, e)}
              error={!!field.error}
              helperText={field.error}
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace",
                  "ArrowLeft",
                  "ArrowRight",
                  "Delete",
                  "Tab",
                  " ",
                ];
                const allowedCharPattern = /^[A-Za-z.,-_ ]$/; // Allow letters, spaces, and some special characters

                // Prevent spaces as the first character
                if (field.value.length === 0 && e.key === " ") {
                  e.preventDefault();
                  return;
                }

                // Check if the pressed key is not allowed
                if (
                  !allowedKeys.includes(e.key) &&
                  !allowedCharPattern.test(e.key)
                ) {
                  e.preventDefault(); // Prevent the default action of the disallowed key
                }
              }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => deleteTermField(index)}
              disabled={term.length <= 1} // Disable for the last field
              sx={{ marginLeft: "10px" }}
            >
              Delete
            </Button>
          </Box>
        ))}
      </div>

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
                <h1>
                  {" "}
                  {invoiceType === "proforma" ? "PROFORMA INVOICE" : "INVOICE"}
                </h1>
                <div style={{ color: "#6b7280" }}>
                  <p style={{ margin: "4px 0" }}>
                    <strong>Invoice :</strong> #
                    {
                       invoiceNumber}
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

                  <th style={{ ...styles.th, textAlign: "right" }}>Subtotal (₹)</th>
                 {showOptionalFields.gst && <th style={{ ...styles.th, textAlign: "right" }}>GST (%)</th>}
              
              {showOptionalFields.gst && <th style={{ ...styles.th, textAlign: "right" }}>GST Amount (₹)</th>}
              <th style={{ ...styles.th, textAlign: "right" }}>Total (₹)</th>
                 
                
                  {invoiceType === "invoice" && (
                    <th style={{ ...styles.th, textAlign: "right" }}>Paid</th>
                  )}
                  {invoiceType === "invoice" && (
                    <th style={{ ...styles.th, textAlign: "right" }}>
                      Balance
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                const serviceCalc  = calculateServiceTotal(service);
              const paidValidation = validatePaidAmount(service);
              const balance = serviceCalc.totalWithGst - parseFloat(service.paid || 0);

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
                    <td style={{ ...styles.td, textAlign: "right"}}>
                    ₹{serviceCalc.subtotal.toFixed(2)}
                  </td>
                    {showOptionalFields.gst && (
                      <td style={{ ...styles.td, textAlign: "right"}}>
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
                      {invoiceType === "invoice" && (
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          ₹{service.paid.toFixed(2)}
                        </td>
                      )}
                      {invoiceType === "invoice" && (
                        <td style={{ ...styles.td, textAlign: "right" }}>
                          ₹{balance.toFixed(2)}
                        </td>
                      )}
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
              <span>CGST ({(gstRate/2).toFixed(2)}%):</span>
              <span>₹{totals.cgst.toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span>SGST ({(gstRate/2).toFixed(2)}%):</span>
              <span>₹{totals.sgst.toFixed(2)}</span>
            </div>
            
          </>
        )}
        
              <div style={styles.totalRowBold}>
                <span>Total:</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
              {invoiceType === "invoice" && (
                <>
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
                </>
              )}
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
                    {terms.value}
                  </li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
        </div>

        <div style={styles.previewFooter}>
          <button
            onClick={handleSubmit}
            style={{ ...styles.button, ...styles.buttonGreen }}
          >
            Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoiceFronetEndPdf;
