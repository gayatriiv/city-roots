import { config } from 'dotenv';

// Load environment variables
config();

// Email configuration
export const emailConfig = {
  // Option 1: Gmail (requires app password)
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || '', // Set EMAIL_USER in environment
      pass: process.env.EMAIL_PASS || '' // Set EMAIL_PASS in environment
    }
  },

  // Option 2: SendGrid
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY || 'your-sendgrid-api-key'
    }
  },

  // Option 3: Custom SMTP
  custom: {
    host: process.env.SMTP_HOST || 'smtp.your-provider.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'your-smtp-username',
      pass: process.env.SMTP_PASS || 'your-smtp-password'
    }
  }
};

// Choose which email provider to use
export const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'gmail';

// Email settings
export const emailSettings = {
  from: `"City Roots" <${process.env.EMAIL_USER || 'noreply@cityroots.com'}>`,
  replyTo: process.env.EMAIL_USER || 'help@cityroots.com',
  supportEmail: process.env.EMAIL_USER || 'help@cityroots.com',
  supportPhone: '+91 12345XXXX'
};
