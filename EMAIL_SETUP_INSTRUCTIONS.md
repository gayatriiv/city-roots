# 📧 Quick Email Setup - Ready to Send Real Emails!

## 🚀 **Steps to Enable Real Email Sending:**

### **Step 1: Get Gmail App Password**
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. **Security** → **2-Step Verification** (enable if not already)
3. **App passwords** → **Generate** → Choose "Mail"
4. **Copy the 16-character password** (like: `abcd efgh ijkl mnop`)

### **Step 2: Update Your Email Credentials**

**Replace these values in `server/config/emailConfig.ts`:**

```typescript
gmail: {
  service: 'gmail',
  auth: {
    user: 'your-actual-email@gmail.com',     // ← Replace with YOUR Gmail
    pass: 'your-16-character-app-password'   // ← Replace with YOUR app password
  }
}
```

**Example:**
```typescript
gmail: {
  service: 'gmail',
  auth: {
    user: 'gayatri.vinod@gmail.com',         // Your Gmail
    pass: 'abcd efgh ijkl mnop'              // Your app password
  }
}
```

### **Step 3: Restart Server**
```bash
npm run dev
```

### **Step 4: Test with Sample Order**
- Place a test order
- Check server console for email sending status
- Check your email inbox (and spam folder)

## ✅ **What You'll See:**

**In Terminal (Success):**
```
📧 SENDING ORDER CONFIRMATION EMAIL:
=====================================
To: customer@example.com
Subject: Order Confirmation - VC123456789 | City Roots
Order Number: VC123456789
Customer: John Doe
Total: ₹1,532.82
Items: 3 items
=====================================

✅ Email sent successfully: <message-id>
```

**In Your Email:**
- Beautiful HTML email with City Roots branding
- Complete order details
- Professional invoice format
- All customer and payment information

## 🔧 **Alternative: Environment Variables**

Create a `.env` file in project root:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Then update `emailConfig.ts`:
```typescript
user: process.env.EMAIL_USER || 'your-email@gmail.com',
pass: process.env.EMAIL_PASS || 'your-app-password'
```

## 🆘 **Troubleshooting:**

- **"Authentication failed"**: Check Gmail credentials and app password
- **"Email not received"**: Check spam folder, verify email address
- **"Connection timeout"**: Check internet connection
- **Still in demo mode**: Make sure you updated both files and restarted server

## 🎉 **Ready to Go!**

Once you update the credentials, the system will send real emails automatically after every successful payment!
