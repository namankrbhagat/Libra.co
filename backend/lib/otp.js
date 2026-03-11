import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("CRITICAL: EMAIL_USER or EMAIL_PASS is missing from environment variables.");
}

const transporter = nodemailer.createTransport({
  service: 'gmail', // Using gmail as default, requires App Password
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  try {
    console.log("[DEBUG] Sending OTP Email to:", email);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Libra.co - Your OTP for Book Sale',
      text: `Your OTP for completing the book sale on Libra.co is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #f97316; margin-bottom: 20px;">Libra.co OTP Verification</h2>
          <p>Your OTP to verify the handover of the book is:</p>
          <h1 style="letter-spacing: 5px; color: #3b82f6; font-size: 32px; background: #f0f9ff; padding: 10px; display: inline-block; border-radius: 4px;">${otp}</h1>
          <p style="margin-top: 20px;">This OTP is valid for 5 minutes.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">If you did not request this, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[DEBUG] Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Nodemailer Error:", error);
    throw error;
  }
};