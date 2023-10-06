const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // OTP documents will automatically expire after 10 minutes
  },
});


module.exports = mongoose.model("OTP", otpSchema);
// const OTP = mongoose.model('OTP', otpSchema);
// module.exports = OTP;
