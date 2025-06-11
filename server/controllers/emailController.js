// server/controllers/emailController.js
const nodemailer = require('nodemailer');
const CompanyEmail = require('../models/CompanyEmail');
const SentEmail = require('../models/SentEmail');

const sendEmails = async (req, res) => {
  const { subject, body } = req.body;
  const file = req.file;

  const companies = await CompanyEmail.find();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let results = [];

  for (let company of companies) {
    try {
      const personalizedBody = body.replace(/{{company_name}}/g, company.companyName);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: company.emailAddress,
        subject,
        text: personalizedBody,
        attachments: file ? [
          {
            filename: file.originalname,
            path: file.path
          }
        ] : []
      });

      await SentEmail.create({
        companyName: company.companyName,
        emailAddress: company.emailAddress,
        subject,
        body: personalizedBody,
        status: 'sent'
      });

      results.push({ company: company.companyName, status: 'sent' });

    } catch (err) {
      await SentEmail.create({
        companyName: company.companyName,
        emailAddress: company.emailAddress,
        subject,
        body,
        status: 'failed'
      });

      results.push({ company: company.companyName, status: 'failed' });
    }
  }

  res.json({ message: 'Emails processed', results });
};

module.exports = { sendEmails };
