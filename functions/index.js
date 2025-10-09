const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp();

// Email configuration for Firebase Functions
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '', // Set EMAIL_USER in environment
    pass: process.env.EMAIL_PASS || ''  // Set EMAIL_PASS in environment
  }
};

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig);

// Cloud Function to send order confirmation email
exports.sendOrderConfirmationEmail = functions.https.onCall(async (data, context) => {
  try {
    const {
      orderNumber,
      customerEmail,
      customerName,
      orderItems,
      total,
      paymentMethod,
      paymentId
    } = data;

    // Generate HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌱 City Roots</h1>
            <h2>Order Confirmation</h2>
          </div>
          <div class="content">
            <h3>Hello ${customerName}!</h3>
            <p>Thank you for your order! Your order #${orderNumber} has been confirmed.</p>
            <p><strong>Total Amount:</strong> ₹${total}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p>We'll send you a tracking number once your order ships.</p>
          </div>
          <div class="footer">
            <p>Need help? Contact us at help@cityroots.com</p>
            <p>Visit us at cityroots.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: '"City Roots" <noreply@cityroots.com>',
      to: customerEmail,
      subject: `Order Confirmation - ${orderNumber} | City Roots`,
      html: htmlContent
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});

// HTTP function alternative
exports.sendOrderEmail = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const orderData = req.body;
    
    // Call the sendOrderConfirmationEmail function
    const result = await exports.sendOrderConfirmationEmail.run(orderData, {});
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});
