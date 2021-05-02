const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "asalar77@yahoo.com", // generated ethereal user
    pass: "hfzfttacbtjoiquh", // generated ethereal password
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendVerifyCode(email, code) {
  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: "asalar77@yahoo.com", // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      //   text: "Hello world?", // plain text body
      html: `<p>Your Code is ${code}</p>`, // html body
    });
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    console.log("email has been sent");
  } catch (e) {
    console.log("failed to sent an email" + e);
  }
}

async function sendResetPassword(email, url) {
  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: "asalar77@yahoo.com", // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      //   text: "Hello world?", // plain text body
      html: `<p>${url}</p>`, // html body
    });
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    console.log("email has been sent");
  } catch (e) {
    console.log("failed to sent an email" + e);
  }
}

// sendEmail("salar.amirahmadiii@gmail.com");
module.exports = {
  sendVerifyCode,
  sendResetPassword,
};
