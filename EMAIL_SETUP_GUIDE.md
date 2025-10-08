# 📧 Email Setup Guide for City Roots

This guide explains how to set up email functionality to send order confirmation emails to customers after they place an order.

## 🎯 **Implementation Options**

### **Option 1: Direct SMTP (Current Implementation)**
Uses nodemailer with SMTP providers like Gmail, SendGrid, or custom SMTP.

### **Option 2: Firebase Cloud Functions**
Uses Firebase Functions to send emails (more scalable for production).

---

## 🔧 **Option 1: Direct SMTP Setup**

### **Step 1: Choose Email Provider**

#### **A) Gmail Setup**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update `server/config/emailConfig.ts`:
   ```typescript
   gmail: {
     service: 'gmail',
     auth: {
       user: 'your-email@gmail.com',
       pass: 'your-16-character-app-password'
     }
   }
   ```

#### **B) SendGrid Setup**
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Update configuration:
   ```typescript
   sendgrid: {
     host: 'smtp.sendgrid.net',
     port: 587,
     secure: false,
     auth: {
       user: 'apikey',
       pass: 'your-sendgrid-api-key'
     }
   }
   ```

#### **C) Custom SMTP**
Configure with your email provider's SMTP settings.

### **Step 2: Environment Variables**
Create a `.env` file in the project root:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_PROVIDER=gmail
```

### **Step 3: Test the Implementation**
The email will be sent automatically after successful payment verification.

---

## 🔥 **Option 2: Firebase Cloud Functions Setup**

### **Step 1: Install Firebase CLI**
```bash
npm install -g firebase-tools
```

### **Step 2: Initialize Firebase Project**
```bash
firebase login
firebase init functions
```

### **Step 3: Configure Functions**
1. Update `functions/package.json` (already created)
2. Update `functions/index.js` with your email credentials
3. Deploy functions:
   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   ```

### **Step 4: Update Server Code**
Replace the direct SMTP call with Firebase function call in `server/routes.ts`:
```typescript
// Instead of sendOrderConfirmationEmail
await sendEmailViaFirebaseFunction(orderData);
```

---

## 📧 **Email Features**

### **What's Included in the Email:**
- ✅ Order confirmation message
- ✅ Order number and date
- ✅ Customer information
- ✅ Delivery address
- ✅ Detailed item list with prices
- ✅ Order summary (subtotal, tax, shipping, total)
- ✅ Payment information
- ✅ Next steps and tracking info
- ✅ Customer support contact details
- ✅ Professional HTML design with City Roots branding

### **Email Template Features:**
- 📱 Mobile-responsive design
- 🎨 City Roots branding and colors
- 📊 Itemized order details
- 💰 Clear pricing breakdown
- 📞 Support contact information
- 🔗 Professional styling

---

## 🚀 **Testing the Email System**

### **Test with Demo Order:**
1. Complete a test order through the checkout process
2. Use test Razorpay credentials
3. Check server logs for email sending status
4. Verify email delivery in customer's inbox

### **Debug Email Issues:**
1. Check server console for error messages
2. Verify email provider credentials
3. Check spam folder
4. Test with different email providers

---

## 🔒 **Security Considerations**

1. **Environment Variables**: Never commit email passwords to git
2. **App Passwords**: Use app-specific passwords, not main account passwords
3. **Rate Limiting**: Consider implementing rate limiting for email sending
4. **Email Validation**: Validate email addresses before sending

---

## 📈 **Production Recommendations**

1. **Use Firebase Functions** for better scalability
2. **Implement email templates** for different order statuses
3. **Add email tracking** and delivery confirmation
4. **Set up email analytics** to monitor delivery rates
5. **Implement retry logic** for failed email sends

---

## 🆘 **Troubleshooting**

### **Common Issues:**
- **"Authentication failed"**: Check email credentials and app passwords
- **"Connection timeout"**: Verify SMTP settings and firewall
- **"Email not received"**: Check spam folder and email provider settings

### **Support:**
- Check server logs for detailed error messages
- Test with different email providers
- Verify network connectivity and firewall settings

---

## ✅ **Current Status**

The email system is now implemented and ready to use! After successful payment verification, customers will automatically receive a professional order confirmation email with all order details.

**Next Steps:**
1. Choose your email provider (Gmail recommended for testing)
2. Set up credentials in `server/config/emailConfig.ts`
3. Test with a sample order
4. Deploy to production when ready
