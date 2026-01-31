const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

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
 * @param {Array} attachments - Optional attachments
 */
const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const info = await transporter.sendMail({
      from: `"NepaliShows" <${process.env.EMAIL_USER}>`, // sender address
      to,
      subject,
      html,
      attachments
    });
    console.log('[Email] Sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    // Don't throw to prevent crashing flow, but log critical error
    return null;
  }
};

/**
 * Generate PDF Invoice
 * @param {object} bookingData 
 * @returns {Promise<Buffer>}
 */
const generateInvoicePDF = (bookingData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        userName,
        eventTitle,
        eventDate,
        eventLocation,
        tickets,
        totalAmount,
        transactionUuid
      } = bookingData;

      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // --- COLORS & FONTS ---
      const darkColor = '#1f2937';
      const primaryColor = '#dc2626'; // Red for BookMyShow vibe
      const grayColor = '#6b7280';
      const lightGray = '#f3f4f6';

      // --- HEADER ---
      doc.fontSize(24).fillColor(primaryColor).text('NepaliShows', 50, 50, { font: 'Helvetica-Bold' });
      doc.fontSize(10).fillColor(grayColor).text('Your Gateway to Events', 50, 75);

      doc.fontSize(28).fillColor(darkColor).text('INVOICE', 400, 50, { align: 'right', font: 'Helvetica-Bold' });

      doc.moveDown();
      doc.strokeColor(lightGray).lineWidth(1).moveTo(50, 100).lineTo(550, 100).stroke();

      // --- INVOICE DETAILS ---
      const topSectionY = 120;

      // Left Side: Billed To
      doc.fontSize(9).fillColor(grayColor).text('BILLED TO', 50, topSectionY);
      doc.fontSize(12).fillColor(darkColor).text(userName, 50, topSectionY + 15, { font: 'Helvetica-Bold' });

      // Right Side: Invoice Meta
      doc.fontSize(9).fillColor(grayColor).text('INVOICE NO.', 350, topSectionY, { width: 90, align: 'right' });
      doc.fontSize(10).fillColor(darkColor).text(transactionUuid.slice(0, 8).toUpperCase(), 450, topSectionY, { width: 100, align: 'right', font: 'Courier-Bold' });

      doc.fontSize(9).fillColor(grayColor).text('DATE', 350, topSectionY + 20, { width: 90, align: 'right' });
      doc.fontSize(10).fillColor(darkColor).text(new Date().toLocaleDateString(), 450, topSectionY + 20, { width: 100, align: 'right' });

      // --- EVENT DETAILS BOX ---
      const eventBoxY = 180;
      doc.rect(50, eventBoxY, 500, 60).fill(lightGray);

      doc.fillColor(darkColor).fontSize(12).text(eventTitle, 70, eventBoxY + 15, { font: 'Helvetica-Bold' });
      doc.fontSize(10).font('Helvetica').text(`${eventDate} | ${eventLocation}`, 70, eventBoxY + 35);

      // --- TABLE HEADER ---
      const tableTop = 270;
      doc.font('Helvetica-Bold').fontSize(10).fillColor(darkColor);
      doc.text('DESCRIPTION', 50, tableTop);
      doc.text('QTY', 300, tableTop, { width: 50, align: 'center' });
      doc.text('RATE', 380, tableTop, { width: 70, align: 'right' });
      doc.text('AMOUNT', 480, tableTop, { width: 70, align: 'right' });

      doc.strokeColor(grayColor).lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // --- TABLE ROWS ---
      let currentY = tableTop + 30;
      let subtotal = 0;
      doc.font('Helvetica').fontSize(10);

      tickets.forEach(item => {
        const amount = item.price * item.quantity;
        subtotal += amount;

        doc.text(item.name, 50, currentY);
        doc.text(item.quantity.toString(), 300, currentY, { width: 50, align: 'center' });
        doc.text(`Rs. ${item.price}`, 380, currentY, { width: 70, align: 'right' });
        doc.text(`Rs. ${amount}`, 480, currentY, { width: 70, align: 'right' });

        currentY += 25;
      });

      // --- TOTALS SECTION ---
      currentY += 10;
      doc.strokeColor(lightGray).lineWidth(1).moveTo(50, currentY).lineTo(550, currentY).stroke();
      currentY += 20;

      const serviceFee = totalAmount - subtotal;

      // Subtotal
      doc.text('Subtotal', 350, currentY, { width: 100, align: 'right' });
      doc.text(`Rs. ${subtotal}`, 480, currentY, { width: 70, align: 'right' });
      currentY += 20;

      // Service Fee
      doc.text('Service Fee (5%)', 350, currentY, { width: 100, align: 'right' });
      doc.text(`Rs. ${serviceFee}`, 480, currentY, { width: 70, align: 'right' });
      currentY += 25;

      // Total
      doc.rect(350, currentY - 10, 200, 35).fill(lightGray);
      doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(14);
      doc.text('TOTAL', 370, currentY, { width: 80, align: 'left' });
      doc.text(`Rs. ${totalAmount}`, 480, currentY, { width: 70, align: 'right' });

      // --- FOOTER ---
      doc.fillColor(grayColor).font('Helvetica').fontSize(9);
      doc.text('Thank you for your business. For support, email support@nepalishows.com', 50, 700, { align: 'center' });
      doc.text(`Payment Reference: ${transactionUuid}`, 50, 715, { align: 'center', font: 'Courier' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Send Booking Confirmation Email
 * @param {string} to - Recipient email
 * @param {object} bookingData - Details of the booking
 */
const sendBookingConfirmation = async (to, bookingData) => {
  const {
    userName,
    eventTitle,
    eventDate,
    eventLocation,
    tickets, // Unused in email body but good to have
    totalAmount, // Unused
    transactionUuid
  } = bookingData;

  const subject = `Your Ticket: ${eventTitle} - NepaliShows`;

  try {
    // 1. Generate QR Code for Email Body
    const qrBuffer = await QRCode.toBuffer(transactionUuid, {
      margin: 1,
      width: 250,
      color: { dark: '#000000', light: '#ffffff' }
    });

    // 2. Generate PDF Invoice
    const pdfBuffer = await generateInvoicePDF(bookingData);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Ticket</title>
        <style>
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.7; margin: 0; padding: 20px; background-color: #f3f4f6; }
          .container { width: 100% !important; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; box-sizing: border-box; }
          .header { border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 30px; }
          .event-card { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #f1f5f9; }
          .qr-container { text-align: center; margin: 40px 0; padding: 30px; background-color: #ffffff; border: 2px solid #f3f4f6; border-radius: 16px; width: fit-content; margin-inline: auto; max-width: 100%; box-sizing: border-box; }
          .qr-container img { max-width: 100%; height: auto; }
          .footer { margin-top: 40px; color: #6b7280; font-size: 15px; border-top: 2px solid #f3f4f6; padding-top: 30px; }
          strong { color: #111827; }

          @media only screen and (max-width: 600px) {
            body { padding: 10px !important; }
            .container { padding: 20px !important; border-radius: 12px !important; }
            .header h1 { font-size: 22px !important; }
            .header p { font-size: 16px !important; }
            .event-card { padding: 15px !important; margin: 20px 0 !important; }
            .event-card div:nth-child(2) { font-size: 18px !important; }
            .qr-container { padding: 15px !important; margin: 25px auto !important; }
            .footer { padding-top: 20px !important; margin-top: 30px !important; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">Hello ${userName},</h1>
            <p style="font-size: 18px; color: #4b5563; margin-top: 8px;">Thank you for booking with NepaliShows. Your ticket is <strong>Confirmed</strong>.</p>
          </div>
          
          <div class="event-card">
            <div style="font-size: 13px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Event Details</div>
            <div style="font-size: 22px; font-weight: 800; color: #111827; margin-bottom: 6px;">${eventTitle}</div>
            <div style="font-size: 16px; color: #4f46e5; font-weight: 600;">📅 ${eventDate}</div>
            <div style="font-size: 16px; color: #4b5563;">📍 ${eventLocation}</div>
          </div>

          <p style="font-size: 17px; margin: 20px 0;">Please find your personal <strong>Entry QR Code</strong> below. Each QR code is uniquely generated for your access.</p>

          <div class="qr-container">
            <div style="font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 15px;">Official Entry QR</div>
            <img src="cid:ticketqr" width="200" style="display: block; margin: 0 auto; border-radius: 8px; max-width: 100%;" />
            <div style="font-size: 13px; color: #6b7280; margin-top: 15px;">Scan at the entrance for access.</div>
          </div>

          <p style="font-size: 17px; margin: 20px 0;">You can find your <strong>itemized receipt and complete booking details</strong> in the attached PDF invoice.</p>

          <p style="font-size: 17px; margin: 20px 0;">Enjoy the event, and we look forward to seeing you there!</p>

          <div class="footer">
            <p style="margin: 0;">Best regards,</p>
            <p style="font-size: 18px; margin-top: 5px;"><strong>The NepaliShows Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const attachments = [
      {
        filename: 'ticket-qr.png',
        content: qrBuffer,
        cid: 'ticketqr'
      },
      {
        filename: `Invoice-${transactionUuid.slice(0, 8)}.pdf`,
        content: pdfBuffer
      }
    ];

    return sendEmail(to, subject, html, attachments);
  } catch (err) {
    console.error('[Email Error]', err);
    return null;
  }
};

/**
 * Send OTP Verification Email
 * @param {string} to - Recipient email
 * @param {string} otp - OTP Code
 * @param {string} type - 'register' or 'email_change'
 */
const sendOTP = async (to, otp, type = 'register') => {
  let subject = 'Your Verification Code - NepaliShows';
  let greeting = 'Verify your email address';
  let messageStart = `Thanks for joining <strong>NepaliShows</strong>! We're excited to have you on board.`;
  let actionText = 'complete your registration';

  if (type === 'email_change') {
    subject = 'Confirm Email Update - NepaliShows';
    greeting = 'Verify New Email Address';
    messageStart = `You requested to update your email address for your <strong>NepaliShows</strong> account.`;
    actionText = 'verify this new email address';
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${greeting}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { width: 100% !important; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); box-sizing: border-box; }
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

        @media only screen and (max-width: 600px) {
          .container { margin: 10px auto !important; border-radius: 12px !important; }
          .content { padding: 30px 20px !important; }
          .otp-code { font-size: 28px !important; letter-spacing: 5px !important; }
          .greeting { font-size: 18px !important; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NepaliShows</h1>
        </div>
        <div class="content">
          <div class="greeting">${greeting}</div>
          <p class="message">
            ${messageStart}
            <br><br>
            Please use the verification code below to ${actionText}. This code is valid for <strong>10 minutes</strong>.
          </p>
          
          <div class="otp-container">
            <div class="otp-code">${otp}</div>
          </div>
          
          <p class="message" style="margin-bottom: 0;">
            If you didn't request this change, please contact support immediately.
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
        .container { width: 100% !important; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); box-sizing: border-box; }
        .header { background-color: #DC2626; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
        .content { padding: 40px 30px; color: #333333; }
        .greeting { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1a1a1a; }
        .message { font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px; }
        .otp-container { background-color: #fef2f2; border: 2px dashed #fecaca; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #991b1b; letter-spacing: 8px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }

        @media only screen and (max-width: 600px) {
          .container { margin: 10px auto !important; border-radius: 12px !important; }
          .content { padding: 30px 20px !important; }
          .otp-code { font-size: 28px !important; letter-spacing: 5px !important; }
          .greeting { font-size: 18px !important; }
        }
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
  sendPasswordResetOTP,
  sendBookingConfirmation
};
