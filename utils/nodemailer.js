const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9856fd2193f4af",
    pass: "1eacb2b0a5ad75",
  },
});

module.exports = { mailTransporter };
