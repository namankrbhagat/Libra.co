import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.error("CRITICAL: TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is missing from environment variables.");
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOtpSMS = async (phone, otp) => {
  try {
    console.log("[DEBUG] Sending SMS from:", process.env.TWILIO_PHONE_NUMBER);

    // E.164 format check
    let formattedPhone = phone;
    if (!phone.startsWith('+')) {
      formattedPhone = `+91${phone}`;
    }

    const message = await client.messages.create({
      body: `Your OTP for Libra.co is ${otp}. It is valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    return message;
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    throw error;
  }
};