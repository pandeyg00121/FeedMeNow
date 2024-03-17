const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      text:message,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Error occurred in sending mail", err);
      } else {
        console.log("Mail sent", info);
      }
    });
  } catch (error) {
    console.log("Unable to send mail", error);
  }
};

module.exports = sendMail;
