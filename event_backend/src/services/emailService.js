const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' or configure host/port manually
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // App Password if using Gmail
  }
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"NepaliShows" <${process.env.EMAIL_USER}>`, // sender address
      to,
      subject,
      html,
    });
    console.log('[Email] Sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    // Don't throw to prevent crashing auth flow, but log critical error
    return null;
  }
};

/**
 * Send OTP Verification Email
 * @param {string} to - Recipient email
 * @param {string} otp - OTP Code
 */
const sendOTP = async (to, otp) => {
  const subject = 'Your Verification Code - NepaliShows';
  // Premium Email Template
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 40px; margin-bottom: 40px; }
        .header { background-color: #4F46E5; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 40px 30px; color: #333333; }
        .greeting { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1a1a1a; }
        .message { font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px; }
        .otp-container { background-color: #f0fdf4; border: 2px dashed #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #15803d; letter-spacing: 8px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .links { margin-top: 10px; }
        .links a { color: #4F46E5; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NepaliShows</h1>
        </div>
        <div class="content">
          <div class="greeting">Verify your email address</div>
          <p class="message">
            Thanks for joining <strong>NepaliShows</strong>! We're excited to have you on board.
            <br><br>
            Please use the verification code below to complete your registration. This code is valid for <strong>10 minutes</strong>.
          </p>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p class="message" style="margin-bottom: 0;">
            If you didn't request this email, you can safely ignore it. Your account will not be activated.
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} NepaliShows Inc. All rights reserved.</p>
          <div class="links">
            <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a> • <a href="#">Support</a>
          </div>
          <p style="margin-top: 10px;">Kathmandu, Nepal</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail(to, subject, html);
};

/**
 * Send Password Reset OTP
 * @param {string} to - Recipient email
 * @param {string} otp - OTP Code
 */
const sendPasswordResetOTP = async (to, otp) => {
  const subject = 'Reset your password - NepaliShows';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #DC2626; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
        .content { padding: 40px 30px; color: #333333; }
        .greeting { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1a1a1a; }
        .message { font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px; }
        .otp-container { background-color: #fef2f2; border: 2px dashed #fecaca; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #991b1b; letter-spacing: 8px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NepaliShows Security</h1>
        </div>
        <div class="content">
          <div class="greeting">Reset your password</div>
          <p class="message">
            We received a request to reset the password for your account. 
            <br><br>
            Use the code below to set up a new password. This code expires in <strong>10 minutes</strong>.
          </p>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p class="message" style="margin-bottom: 0;">
            If you didn't ask to reset your password, please ignore this email. Your account is safe.
          </p>
        </div>
        <div class="footer">
          <p>Secure Account Alert • NepaliShows Inc.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendOTP,
  sendPasswordResetOTP
};
