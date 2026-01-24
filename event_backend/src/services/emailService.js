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
        userPhone,
        eventTitle,
        eventDate,
        eventLocation,
        tickets,
        totalAmount,
        transactionUuid
      } = bookingData;

      const subtotal = tickets.reduce((acc, t) => acc + (t.price * t.quantity), 0);
      const serviceFee = totalAmount - subtotal;

      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // --- PDF CONTENT ---

      // Header / Logo
      doc.fillColor('#4f46e5').fontSize(26).text('NepaliShows', 50, 50, { font: 'Helvetica-Bold' });
      doc.fillColor('#9ca3af').fontSize(10).text('OFFICIAL BOOKING INVOICE', 50, 80);

      // Invoice Details (Right Side)
      doc.fillColor('#111827').fontSize(10).text(`Invoice ID: ${transactionUuid.slice(0, 8).toUpperCase()}`, 400, 50, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, 65, { align: 'right' });
      doc.text(`Transaction: ${transactionUuid}`, 400, 80, { align: 'right', font: 'Courier' });

      doc.moveDown(3);
      doc.strokeColor('#f3f4f6').lineWidth(1).moveTo(50, 110).lineTo(550, 110).stroke();

      // Attendee & Event info
      doc.moveDown(2);
      const startY = doc.y;

      doc.fillColor('#6b7280').fontSize(8).text('BILLED TO', 50, startY);
      doc.fillColor('#111827').fontSize(12).text(userName, 50, startY + 15, { font: 'Helvetica-Bold' });
      doc.fontSize(10).text(userPhone || 'N/A', 50, startY + 32, { font: 'Helvetica' });

      doc.fillColor('#6b7280').fontSize(8).text('EVENT DETAILS', 300, startY);
      doc.fillColor('#4f46e5').fontSize(14).text(eventTitle, 300, startY + 15, { font: 'Helvetica-Bold' });
      doc.fillColor('#111827').fontSize(10).text(`Date: ${eventDate}`, 300, startY + 34, { font: 'Helvetica' });
      doc.text(`Venue: ${eventLocation}`, 300, startY + 49);

      doc.moveDown(4);

      // Ticket Table Header
      const tableTop = doc.y;
      doc.fillColor('#f9fafb').rect(50, tableTop, 500, 25).fill();
      doc.fillColor('#9ca3af').fontSize(9).text('DESCRIPTION', 60, tableTop + 8);
      doc.text('QTY', 350, tableTop + 8, { width: 50, align: 'center' });
      doc.text('TOTAL', 400, tableTop + 8, { width: 150, align: 'right' });

      // Table Rows
      let currentY = tableTop + 30;
      doc.fillColor('#111827');
      tickets.forEach(item => {
        doc.fontSize(10).text(item.name, 60, currentY);
        doc.text(item.quantity.toString(), 350, currentY, { width: 50, align: 'center' });
        doc.text(`Rs. ${item.price * item.quantity}`, 400, currentY, { width: 150, align: 'right' });

        currentY += 25;
        doc.strokeColor('#f3f4f6').lineWidth(0.5).moveTo(50, currentY - 5).lineTo(550, currentY - 5).stroke();
      });

      // --- Calculation Block (Tabular Structure) ---
      doc.moveDown(1);
      const calcY = doc.y;
      doc.strokeColor('#f3f4f6').lineWidth(1).moveTo(300, calcY).lineTo(550, calcY).stroke();

      const drawCalcRow = (label, value, y, isBold = false) => {
        doc.fillColor('#6b7280').fontSize(10).text(label, 300, y + 10, { font: isBold ? 'Helvetica-Bold' : 'Helvetica' });
        doc.fillColor(isBold ? '#4f46e5' : '#111827').fontSize(isBold ? 14 : 10).text(`Rs. ${value}`, 400, y + 10, { width: 150, align: 'right', font: isBold ? 'Helvetica-Bold' : 'Helvetica' });
      };

      drawCalcRow('Subtotal', subtotal, calcY);
      drawCalcRow('Service Fee (5%)', serviceFee, calcY + 20);

      doc.strokeColor('#111827').lineWidth(1).moveTo(300, calcY + 45).lineTo(550, calcY + 45).stroke();
      drawCalcRow('Grand Total Paid', totalAmount, calcY + 45, true);

      // QR Code
      const qrBuffer = await QRCode.toBuffer(transactionUuid, { scale: 4 });
      doc.image(qrBuffer, 50, calcY + 130, { width: 100 });

      doc.fillColor('#9ca3af').fontSize(8).text('SCAN FOR ENTRY', 50, calcY + 235);
      doc.fillColor('#6b7280').text('Each QR code represents a unique valid entry. Please have this digital or printed version ready at the venue gate for a smooth entry process.', 160, calcY + 135, { width: 300, align: 'left', lineGap: 4 });

      // Footer
      doc.fontSize(8).text('© 2026 NepaliShows Inc. | Thank you for your business!', 50, 780, { align: 'center', color: '#cbd5e1' });

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
    userPhone,
    eventTitle,
    eventDate,
    eventLocation,
    tickets,
    totalAmount,
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
        <style>
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.7; margin: 0; padding: 40px; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb; }
          .header { border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; margin-bottom: 30px; }
          .event-card { background: #f9fafb; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #f1f5f9; }
          .qr-container { text-align: center; margin: 40px 0; padding: 30px; background-color: #ffffff; border: 2px solid #f3f4f6; border-radius: 16px; width: fit-content; margin-inline: auto; }
          .footer { margin-top: 40px; color: #6b7280; font-size: 15px; border-top: 2px solid #f3f4f6; padding-top: 30px; }
          strong { color: #111827; }
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

          <p style="font-size: 17px;">Please find your personal <strong>Entry QR Code</strong> below. Each QR code is uniquely generated for your access.</p>

          <div class="qr-container">
            <div style="font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 15px;">Official Entry QR</div>
            <img src="cid:ticketqr" width="200" style="display: block; margin: 0 auto; border-radius: 8px;" />
            <div style="font-size: 13px; color: #6b7280; margin-top: 15px;">Scan at the entrance for access.</div>
          </div>

          <p style="font-size: 17px;">You can find your <strong>itemized receipt and complete booking details</strong> in the attached PDF invoice.</p>

          <p style="font-size: 17px;">Enjoy the event, and we look forward to seeing you there!</p>

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
 */
const sendOTP = async (to, otp) => {
  const subject = 'Your Verification Code - NepaliShows';
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
  sendPasswordResetOTP,
  sendBookingConfirmation
};
