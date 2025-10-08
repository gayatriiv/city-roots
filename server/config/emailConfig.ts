// Email configuration
export const emailConfig = {
  // Option 1: Gmail (requires app password)
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'gayatriv1717@gmail.com', // Replace with your Gmail
      pass: process.env.EMAIL_PASS || 'zrsr txmg ppxr uton'
      // Replace with your 16-char app password
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
  from: `"City Roots" <noreply@cityroots.com>`,
  replyTo: 'help@cityroots.com',
  supportEmail: 'help@cityroots.com',
  supportPhone: '+91 12345XXXX'
};
