const mongoose =require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceName: String,
  description: String,
  price: Number,
  gstBoolean: Boolean,
  discountBoolean: Boolean,
  quantityBoolean: Boolean,
  quantity: Number,
  gst: Number,
  discount: Number,
  total: Number,
  gstAmount: Number,
  paid: Number,
  balance: Number
} ,{ _id: true });

const customerSchema = new mongoose.Schema({
  type: String,
  businessName: String,
  phone: String,
  email: String,
  gst: String,
  pan: String,
  street: String,
  district: String,
  state: String,
  country: String,
  pincode: String
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  date: String,
  clientDetails: customerSchema,
  services: [serviceSchema],
  term: [String],
  totalAmount: Number,
  totalPaid: Number,
  balanceDue: Number
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
