# 📧 Quick Email Setup Guide

## 🚨 **Current Status: Demo Mode**

The email system is currently in **demo mode** - it logs email details to the console instead of sending actual emails. This is to avoid email delivery issues during development.

## ✅ **What You'll See Now**

After placing an order, you'll see this in the server console:
```
📧 ORDER CONFIRMATION EMAIL WOULD BE SENT:
==========================================
To: customer@example.com
Subject: Order Confirmation - VC040080113 | City Roots
Order Number: VC040080113
Customer: John Doe
Total: ₹1,532.82
Items: 3 items
==========================================
```

## 🚀 **To Enable Real Email Sending**

### **Option 1: Gmail Setup (Recommended for Testing)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update Email Configuration**:
   - Edit `server/config/emailConfig.ts`
   - Replace `cityroots.demo@gmail.com` with your Gmail
   - Replace `demo-password` with your app password
4. **Uncomment Email Code**:
   - Edit `server/services/emailService.ts`
   - Uncomment lines 97-110 (the actual email sending code)
   - Comment out lines 85-94 (the demo logging code)

### **Option 2: SendGrid (Professional)**

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API key
3. Update `server/config/emailConfig.ts`:
   ```typescript
   // Change EMAIL_PROVIDER to 'sendgrid'
   export const EMAIL_PROVIDER = 'sendgrid';
   ```
4. Set environment variable: `SENDGRID_API_KEY=your-api-key`

## 🔧 **Quick Test Setup**

If you want to test with Gmail right now:

1. **Update `server/config/emailConfig.ts`**:
   ```typescript
   gmail: {
     service: 'gmail',
     auth: {
       user: 'your-actual-email@gmail.com',
       pass: 'your-16-character-app-password'
     }
   }
   ```

2. **Update `server/services/emailService.ts`**:
   - Comment out lines 85-94 (demo logging)
   - Uncomment lines 97-110 (real email sending)

3. **Restart the server**:
   ```bash
   npm run dev
   ```

4. **Test with a sample order**

## 📱 **Email Preview**

The email will include:
- ✅ Professional City Roots branding
- ✅ Complete order details
- ✅ Customer information
- ✅ Delivery address
- ✅ Itemized product list
- ✅ Payment summary
- ✅ Support contact details

## 🆘 **Need Help?**

- Check server console for error messages
- Verify Gmail app password is correct
- Check spam folder
- Test with different email addresses

---

**Current Status**: ✅ Demo mode working - emails logged to console  
**Next Step**: Set up Gmail credentials to enable real email sending
