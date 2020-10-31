require("dotenv/config");
const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9856fd2193f4af",
    pass: "1eacb2b0a5ad75",
  },
});
const mailDetails = {
  from: `Debora <debora@boop.com>`,
  to: `debora.crescenzo@gmail.com`,
  subject: `Boop Email Confirmation`,
  // text: `Hello , welcome to Boop! `,
  html: `<b><h1>Hello, </h1>,<p> welcome to Boop! </p><p>Here your details: <strong>email:  </strong><strong>password: toHash</strong>.</p><footnote>Login to edit your details or delete your profile</footnote></b>`,
};

const test = async () => {
  const testMail = await mailTransporter.sendMail(mailDetails);
  console.log(testMail);
};
test().catch(console.error);
