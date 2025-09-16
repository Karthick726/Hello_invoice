import React from "react";
import axiosInstance from "../api/AxiosInstance";

const GeneratePDFButton = () => {
  const handleDownloadPDF = async () => {
    try {
      const response = await axiosInstance.get("/text-pdf", {
        responseType: "blob", 
      });

      // Create a URL for the PDF blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice.pdf"); // Specify the file name

      // Append to the body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div>
      <button onClick={handleDownloadPDF}>Generate PDF</button>
    </div>
  );
};

export default GeneratePDFButton;
