const Invoice = require("../models/InvoicesModel");



// Add new  invoice
exports.createInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      date,
   customerDetails,
      services,
      term,
      totalAmount,
      totalPaid,
      balanceDue
    } = req.body;


    console.log("date",date)
    
    


    const alreadyInvoice = await Invoice.findOne({ invoiceNumber });

if (alreadyInvoice) {
  return res.status(400).json({
    success: false,
    message: "Invoice number already exists",
  });
}

let paymentStatus;
if (balanceDue === 0) {
  paymentStatus = "Fully Paid";
} else if (balanceDue === totalAmount) {
  paymentStatus = "Unpaid";
}else {
  paymentStatus = "Partially Paid";
}
    // Map customerDetails to clientDetails (schema field)
    const newInvoice = new Invoice({
      invoiceNumber,
      date,
      clientDetails: customerDetails,
      services,
    term,
        totalAmount,
      totalPaid,
      balanceDue,paymentStatus
    });

    const savedInvoice = await newInvoice.save();

    return res.status(200).json({
      success: true,
      message: " invoice created successfully",
      data: savedInvoice
    });
  } catch (error) {
    console.error("Error creating  invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create  invoice",
      error: error.message
    });
  }
};


exports.getInvoiceByNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.body; // get from URL params

    const invoice = await Invoice.findOne({ invoiceNumber });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: `Invoice with number ${invoiceNumber} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching invoice",
    });
  }
};

exports.getInvoiceNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.body; // get from URL params

    const invoice = await Invoice.findOne({ invoiceNumber });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: `Invoice with number ${invoiceNumber} not found`,
      });
    }

    if(invoice.paymentStatus === "Fully Paid"){
  return res.status(404).json({
        success: false,
        message: `Invoice with number ${invoiceNumber} is Fully Paided`,
      });

    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching invoice",
    });
  }
};

exports.getInvoice=async(req,res)=>{
  try{
 const invoice = await Invoice.find();

  

    res.status(200).json({
      success: true,
      data: invoice,
    });

  }catch(err){
 console.error("Error fetching invoice:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching invoice",
    });
  }
}


// Update Proforma Invoice by invoiceNumber
exports.updateProformaInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      date,
      customerDetails,
      services,
      term,
      totalAmount,
      totalPaid,
      balanceDue,
    } = req.body;


    let paymentStatus;
if (balanceDue === 0) {
  paymentStatus = "Fully Paid";
} else if (balanceDue === totalAmount) {
  paymentStatus = "Unpaid";
}else {
  paymentStatus = "Partially Paid";
}

    // Prepare update payload
    const updatedData = {
      invoiceNumber,
      date,
      clientDetails: customerDetails, // map customerDetails → clientDetails
      services,
       term,
      totalAmount,
      totalPaid,
      balanceDue,
      paymentStatus
    };

    // Find by invoiceNumber and update
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { invoiceNumber },            // search condition
      { $set: updatedData },        // update data
      { new: true, runValidators: true } // return updated doc
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update invoice",
      error: error.message,
    });
  }
};
