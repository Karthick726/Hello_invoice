const ProformaInvoice = require("../models/invoiceModel");



// Add new proforma invoice
exports.createProformaInvoice = async (req, res) => {
  try {
    const {
      invoiceNumber,
      date,
      customerDetails,
      services,
      term
    } = req.body;

    // Map customerDetails to clientDetails (schema field)
    const newInvoice = new ProformaInvoice({
      invoiceNumber,
      date,
      clientDetails: customerDetails,
      services,
      terms:term
    });

    const savedInvoice = await newInvoice.save();

    return res.status(200).json({
      success: true,
      message: "Proforma invoice created successfully",
      data: savedInvoice
    });
  } catch (error) {
    console.error("Error creating proforma invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create proforma invoice",
      error: error.message
    });
  }
};

exports.getInvoiceByNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.body; // get from URL params

    const invoice = await ProformaInvoice.findOne({ invoiceNumber });

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
