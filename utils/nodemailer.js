const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

module.exports = mailTransporter;
