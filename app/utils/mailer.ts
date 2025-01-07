import { json } from "@remix-run/react";
import nodemailer from "nodemailer";

// Create the transporter using Gmail's SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS, // Your Gmail password or app-specific password
  },
});

// Service to send emails
export const sendEmailService = async (
  to: string[], // List of recipient emails
  subject: string, // Email subject
  html: string, // HTML message content
  text?: string // Optional plain text fallback
) => {
  const mailOptions = {
    subject, // Subject of the email
    html, // HTML content
    text, // Plain text fallback (optional)
  };

  // Function to send an email to a single recipient
  const sendToRecipient = async (email: string) => {
    await transporter.sendMail({ ...mailOptions, to: email });
  };

  // Send emails to all recipients in parallel
  await Promise.all(to.map(sendToRecipient));
};

// Example usage
export const sendMail = async (email: any) => {
  const recipients = [email];
  const subject = "Reset Your Password";
  const htmlContent = `
  <h1>Password Reset Request</h1>
  <p>Hello,</p>
  <p>We received a request to reset your password. If you made this request, please click the link below to reset your password:</p>
  <p><a href="${process.env.BASE_URL}/reset?email=${email}" style="color: #007bff; text-decoration: none;">Reset Password</a></p>
  <p>If you did not request a password reset, you can safely ignore this email.</p>
  <p>Thank you,<br>Project Management App</p>
`;
  const plainTextContent = `
  Hello,

  We received a request to reset your password. If you made this request, please use the link below to reset your password:

  ${process.env.BASE_URL}/reset?email=${email}

  If you did not request a password reset, you can safely ignore this email.

  Thank you,
  Project Management App.
`;

  try {
    await sendEmailService(recipients, subject, htmlContent, plainTextContent);
    return json({ success: "Email send!" }, { status: 200 });
  } catch (error) {
    return json({ error: "somthing went wrong!" }, { status: 400 })
  }
};
