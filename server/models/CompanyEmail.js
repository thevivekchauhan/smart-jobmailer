// const mongoose = require('mongoose');

// const companyEmailSchema = new mongoose.Schema({
//     companyName: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     emailAddress: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
//     },
//     addedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('CompanyEmail', companyEmailSchema);

// server/models/CompanyEmail.js
const mongoose = require('mongoose');

const companyEmailSchema = new mongoose.Schema({
  companyName: String,
  emailAddress: String,
});

module.exports = mongoose.model('CompanyEmail', companyEmailSchema);
