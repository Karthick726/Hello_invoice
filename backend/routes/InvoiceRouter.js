const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const Invoice=require("../controller/InvoiceController")

// Define routes
router.post("/post-invoice", auth,Invoice.createInvoice );

router.post("/get-number-invoice", auth,Invoice.getInvoiceByNumber );

router.post("/get-numberby-invoice", auth,Invoice.getInvoiceNumber );

router.post("/update-invoice", auth,Invoice.updateProformaInvoice );

router.get("/get-invoice", auth,Invoice.getInvoice );




module.exports = router;
