const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street: String,
  district: String,
  state: String,
  country: String,
  pincode: Number,
});

const AccountSchema = new mongoose.Schema({
  accountName: String,
  accountNumber: String,
  ifceCode: String,
  bankName: String,
  accountType: String,
  gstNumber: String,
  gpay: Number,
});

const InfoSchema = new mongoose.Schema(
  {
    companyName: String,
    phone: Number,
    mobile: Number,
    gst:String,
    pan:String,
    Address: AddressSchema,
    service: [String],
    accountInfo: AccountSchema,
    TermsAndCondition: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Info", InfoSchema);
