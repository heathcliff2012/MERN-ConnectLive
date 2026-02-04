import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hndange@gmail.com",
    pass: process.env.EMAIL_SERVICE,
  },
});

const sendMail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"My App" <hndange@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export { sendMail };