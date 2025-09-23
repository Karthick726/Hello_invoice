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
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../assets/logo1.webp";
import { TextField, Button, Box } from "@mui/material";
import { Plus, Trash2, Download } from "lucide-react";

const InvoiceUpdate = () => {

     const invoiceRef = useRef();
      const [servicess, setServicess] = useState([]);
       const [info, setInfo] = useState([]);
       const [open, setOpen] = useState(false);
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
          balance:0,
          alreadyPaid:0
        },
      ]);
    
      const [invoiceNumber, setInvoiceNumber] = useState("HTM-");

      //error
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

    //style
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

  //search with invoice number
   const searchInvoice=async()=>{
    if(invoiceNumber.length !=10){
        alert("Please enter the Invoice number")
        return;
    }
    try{
  
       const response = await AxiosInstance.post("/invoice/get-numberby-invoice",{invoiceNumber},{withCredentials:true})
  
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
  
  
  setOpen(true)
  
  setTerm(response.data.data.term.map((value)=>{ return {value:value,error:""}}))
  setServices(
    optionFields.map((s) => ({
      id: s._id,                         // MongoDB ID
      name: s.description || "",         // map serviceName → name
      selectedService: s.serviceName || "", // or use another field for dropdown
      price: s.price || 0,
      quantity: s.quantity || 1,
      discount: s.discount || 0,
      alreadyPaid: s.paid, // default, unless backend has it
      paid:0,
      balance:s.balance
    }))
  );
       }
    }catch(err){
      console.log(err)
      setOpen(false)
      if(err.message && err.response.status===404){
        alert(err.response.data.message)
        return
      }
      alert("Invoice Not found")
    }
    }

    console.log(services)

//update
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

  // If discount is percentage
  const discountAmount = showOptionalFields.discount
    ? (baseAmount * service.discount) / 100
    : 0;

  const subtotal = baseAmount - discountAmount;

  // GST for this service
  const gstAmount = showOptionalFields.gst ? (subtotal * gstRate) / 100 : 0;
  const totalWithGst = subtotal + gstAmount;

  // Payment calculations
  const alreadyPaid = parseFloat(service.alreadyPaid || 0);
  const newlyPaid = parseFloat(service.paid || 0);
  const totalPaid = alreadyPaid + newlyPaid;
  const balance = totalWithGst - totalPaid;

  return {
    baseAmount,
    discountAmount,
    subtotal,
    gstAmount,
    totalWithGst,
    alreadyPaid,
    newlyPaid,
    totalPaid,
    balance,
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

  const totalAlreadyPaid = serviceCalculations.reduce((sum, calc) => sum + calc.alreadyPaid, 0);
  const totalNewlyPaid = serviceCalculations.reduce((sum, calc) => sum + calc.newlyPaid, 0);
  const totalPaid = totalAlreadyPaid + totalNewlyPaid;

  const balance = total - totalPaid;

  return {
    subtotal,
    cgst,
    sgst,
    total,
    totalPaid,
    totalAlreadyPaid,
    totalNewlyPaid,
    balance,
    totalGst: totalGstAmount,
    serviceCalculations,
  };
};

// Validate individual service's newly paid input
const validatePaidAmount = (service) => {
  const serviceCalc = calculateServiceTotal(service);
  const newlyPaid = parseFloat(service.paid || 0);

  if (newlyPaid + serviceCalc.alreadyPaid > serviceCalc.totalWithGst) {
    return { 
      isValid: false, 
      message: `Paid amount cannot exceed ₹${serviceCalc.totalWithGst.toFixed(2)}`
    };
  }
  if (newlyPaid < 0) {
    return { isValid: false, message: "Paid amount cannot be negative" };
  }
  return { isValid: true, message: "" };
};



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
  
      const totals = calculateOverallTotals();


      const validateThePdf = () => {
      
        if(date===""){
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
         
      const validateAmount = (services) => {
  return services.map(service => {
    const serviceCalc = calculateServiceTotal(service);
    const paidValidation = validatePaidAmount(service);
    const paid = parseFloat(service.paid || 0);
    const balance = serviceCalc.totalWithGst - paid;

    if (!paidValidation.isValid) {
      return { isValid: false, message: paidValidation.message, service };
    }
    if (balance < 0) {
      return { isValid: false, message: "Negative balance not allowed", service };
    }
    return { isValid: true, message: "", service };
  });
};

       const handleSubmit=async()=>{
         
              if(!validateThePdf()){
                return false;
              }
      
             const results = validateAmount(services);
const allValid = results.every(r => r.isValid);

if (!allValid) {
  alert("One or more services have negative balance!");
  return false;
}
         try{

          const response=await AxiosInstance.post("/invoice/update-invoice",
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
                const serviceCalc  = calculateServiceTotal(value);
                 return {
                     id:value.id,
                  serviceName:value.selectedService,
                  description:value.name,
                  price:value.price,
                  gstBoolean:showOptionalFields.gst,
                  discountBoolean:showOptionalFields.discount,
                  quantityBoolean:showOptionalFields.quantity,
                  quantity:value.quantity,
                  gst:gstRate,
                  discount:value.discount,
                  total:serviceCalc.totalWithGst,
                  gstAmount:serviceCalc.gstAmount,
                  paid:serviceCalc.totalPaid,
                  balance:serviceCalc.balance
                 }
              }),
              term:term.map((value)=> value.value),
              totalAmount:totals.total,
              totalPaid:totals.totalPaid,
              balanceDue:totals.balance,
            }

          )

          if(response.status===200){
            alert("Sucessully  invoice data stored")
             handleDownload()
          }
              }catch(err){
                console.log(err)
              }   
          
       }

  return (
          <Fragment>
         <main id="main" className="main">
           <div className="pagetitle">
             <nav>
               <ol className="breadcrumb">
                 <li className="breadcrumb-item">
                   <Link to="/">Home</Link>
                 </li>
                 <li className="breadcrumb-item active">Balance Due  Invoice update</li>
               </ol>
             </nav>
           </div>
           <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Search Invoice Number</h1>

        <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                style={styles.input}
                disabled={open}
                placeholder="HTM-123445"
                maxLength={10}
              />
            </div>
          
        </div>
            <div>
              <button onClick={searchInvoice} style={styles.button} disabled={open}>
                Search Invoice
              </button>
              </div>
      </div>

      {
        open && (
            <>
             <div style={styles.card}>
        <h1 style={styles.title}>Date</h1>

        <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Date</label>
               <input
              type="date"
              id="date-selector"
              style={styles.input}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            </div>
          
        </div>
           
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
                              disabled
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
                              disabled
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
                              disabled
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
                              disabled
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
                              disabled
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
                              disabled
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
                              disabled
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
                              disabled
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
                              disabled
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
                              disabled
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
                              disabled
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
            
                      {/* <button onClick={addService} style={styles.button}>
                        <Plus size={16} />
                        Add Service
                      </button> */}
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
                            disabled
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
                             disabled
                          />
                          Quantity
                        </label>
                        <label style={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={showOptionalFields.discount}
                            onChange={(e) =>{
                              setShowOptionalFields({
                                ...showOptionalFields,
                                discount: e.target.checked,
                              })
            
                              const serviceUpdate = services.map(service => ({
              ...service,
              discount: 0
            }));
            
                              setServices(serviceUpdate)
                            }
                            }
                             disabled
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
                         
           <th style={styles.th}>Already Paid</th>
                 <th style={styles.th}>Balance Due Paid</th>
                 <th style={styles.th}>Total Paid</th>
                  <th style={styles.th}>Balance</th>
                
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
                                  <span style={{
                                    fontWeight:"bold"
                                  }}> Service Name : </span>
                                  <span style={{
                                    color:"red"
                                  }}>
 {service.selectedService}
                                  </span>
                                 
                                  </div>
                                  <div className="mt-2">
                                     <span style={{
                                    fontWeight:"bold"
                                  }}> Service Description : </span>
                                    {
                                        service.name.split("\n").map((value,index)=>{
                                            return <p style={{
                                                marginLeft:"20px"
                                            }}>  <span className="dot"></span> {value}</p>
                                        })
                                    }
                                  </div>
                                </td>
                                <td style={{ ...styles.td, textAlign: "right" }}>
                                  
                       ₹ {service.price.toFixed(2)}
                                </td>
                                {showOptionalFields.quantity && (
                                  <td style={{ ...styles.td, textAlign: "right" }}>
                                  {service.quantity}
                                  </td>
                                )}
                                {showOptionalFields.discount && (
                                  <td style={{ ...styles.td, textAlign: "right" }}>
                                   {service.discount}
                                      
                                  </td>
                                )}
                                  <td style={{ ...styles.td, textAlign: "right", fontWeight: 'bold' }}>
                                ₹{serviceCalc.subtotal.toFixed(2)}
                              </td>
                                {showOptionalFields.gst && (
                                  <td style={{ ...styles.td, textAlign: "right", fontWeight: 'bold' }}>
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
                                  ₹{service.alreadyPaid.toFixed(2)}
                                </td>
                            
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

                 <td style={{ ...styles.td, textAlign: "right" }}>
                        ₹{serviceCalc.totalPaid.toFixed(2)}
                      </td>
                 
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        ₹{serviceCalc.balance.toFixed(2)}
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
                          disabled
                        />
                       
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
                            
                               PROFORMA INVOICE
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
                                {info.length > 0 ? info[0].gst || "N/A" : "N/A"}
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
                             
                   
                  <th style={{ ...styles.th, textAlign: "right" }}>Already Paid</th>
                 <th style={{ ...styles.th, textAlign: "right" }}>Balance Due Paid</th>
                 <th style={{ ...styles.th, textAlign: "right" }}>Total Paid</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Balance</th>
          
                 
                  
                            
                            </tr>
                          </thead>
                          <tbody>
                            {services.map((service) => {
                          const serviceCalc  = calculateServiceTotal(service);
     
            
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
                               
                        <td style={{ ...styles.td, textAlign: "right" }}>
                                  ₹{service.alreadyPaid.toFixed(2)}
                                </td>
                            
                      <td style={{ ...styles.td, textAlign: "right" }}>
                      ₹{service.paid.toFixed(2)}
                    
                      </td>

                 <td style={{ ...styles.td, textAlign: "right" }}>
                        ₹{serviceCalc.totalPaid.toFixed(2)}
                      </td>
                 
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        ₹{serviceCalc.balance.toFixed(2)}
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
            
            </>
        )
      }
      </div>

           </main>
           </Fragment>
  )
}

export default InvoiceUpdate