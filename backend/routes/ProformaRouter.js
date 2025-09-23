const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const proformaInvoice=require("../controller/ProformaContoller")

// Define routes
router.post("/post-invoice", auth,proformaInvoice.createProformaInvoice );

router.post("/update-invoice", auth,proformaInvoice.updateProformaInvoice );

router.post("/get-invoice",auth,proformaInvoice.getInvoiceByNumber);

router.post("/get-number-invoice",auth,proformaInvoice.getInvoiceNumber);

router.get("/get-proforma",auth,proformaInvoice.getInvoice)


module.exports = router;
