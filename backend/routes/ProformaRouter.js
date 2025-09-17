const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const proformaInvoice=require("../controller/ProformaContoller")

// Define routes
router.post("/post-invoice", auth,proformaInvoice.createProformaInvoice );

router.post("/get-invoice",auth,proformaInvoice.getInvoiceByNumber)


module.exports = router;
