// server/models/SentEmail.js
const mongoose = require('mongoose');

const sentEmailSchema = new mongoose.Schema({
  companyName: String,
  emailAddress: String,
  subject: String,
  body: String,
  status: String, // sent / failed
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SentEmail', sentEmailSchema);
