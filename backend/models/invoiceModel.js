const mongoose = require('mongoose');

const clientDetailsSchema = new mongoose.Schema({
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

const serviceSchema = new mongoose.Schema({
  serviceName: String,
  description: [String],
  price: Number,
  discountBoolean: Boolean,
  gstBoolean: Boolean,
  quantityBoolean: Boolean,
  quantity: Number,
  gst: Number,
  discount: Number,
  
}, { _id: true });

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  date: Date,
  dueDate: Date,
  clientDetails: clientDetailsSchema,
  services: [serviceSchema],
  terms: [String],
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
