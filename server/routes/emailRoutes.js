// const express = require('express');
// const router = express.Router();
// const CompanyEmail = require('../models/CompanyEmail');

// // Add a new company email
// router.post('/companies', async (req, res) => {
//     try {
//         const { companyName, emailAddress } = req.body;
        
//         // Check if company with this email already exists
//         const existingCompany = await CompanyEmail.findOne({ emailAddress });
//         if (existingCompany) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         const company = new CompanyEmail({
//             companyName,
//             emailAddress
//         });

//         await company.save();
//         res.status(201).json(company);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get all companies
// router.get('/companies', async (req, res) => {
//     try {
//         const companies = await CompanyEmail.find().sort({ companyName: 1 });
//         res.json(companies);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Delete a company email
// router.delete('/companies/:id', async (req, res) => {
//     try {
//         const company = await CompanyEmail.findByIdAndDelete(req.params.id);
//         if (!company) {
//             return res.status(404).json({ message: 'Company not found' });
//         }
//         res.json({ message: 'Company deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// module.exports = router;



// server/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { sendEmails } = require('../controllers/emailController');
const CompanyEmail = require('../models/CompanyEmail');

// Route to add company email
router.post('/add-company', async (req, res) => {
  const { companyName, emailAddress } = req.body;
  const newEntry = new CompanyEmail({ companyName, emailAddress });
  await newEntry.save();
  res.json({ message: 'Company added' });
});

// Route to send emails with attachment
router.post('/send-emails', upload.single('attachment'), sendEmails);

// Route to get all companies
router.get('/companies', async (req, res) => {
  const companies = await CompanyEmail.find();
  res.json(companies);
});

module.exports = router;
