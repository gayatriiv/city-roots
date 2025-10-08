# Vercel Deployment Guide for City Roots

## Firebase Admin SDK Setup for Vercel

Your Vercel deployment is failing because Firebase Admin SDK can't authenticate properly. Here's how to fix it:

### Step 1: Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `city-roots` project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file

### Step 2: Extract Required Values

From the downloaded JSON file, you need these values:

```json
{
  "type": "service_account",
  "project_id": "city-roots",
  "private_key_id": "your_private_key_id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@city-roots.iam.gserviceaccount.com",
  "client_id": "your_client_id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40city-roots.iam.gserviceaccount.com"
}
```

### Step 3: Set Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `city-roots` project
3. Go to **Settings** → **Environment Variables**
4. Add these environment variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `FIREBASE_PRIVATE_KEY` | The `private_key` value from JSON (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`) | Production, Preview, Development |
| `FIREBASE_CLIENT_EMAIL` | The `client_email` value from JSON | Production, Preview, Development |
| `FIREBASE_PRIVATE_KEY_ID` | The `private_key_id` value from JSON | Production, Preview, Development |
| `FIREBASE_CLIENT_ID` | The `client_id` value from JSON | Production, Preview, Development |

### Step 4: Important Notes

- **Copy the private key EXACTLY** as it appears in the JSON file, including the `\n` characters
- Make sure to select all environments (Production, Preview, Development) for each variable
- The private key should look like: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n`

### Step 5: Redeploy

After setting the environment variables:

1. Go to your Vercel project dashboard
2. Click **Deployments**
3. Click the three dots on your latest deployment
4. Select **Redeploy**

Or simply push a new commit to trigger a new deployment.

### Step 6: Verify Deployment

Once redeployed, your application should:

1. ✅ Initialize Firebase Admin SDK successfully
2. ✅ Connect to Firestore database
3. ✅ Handle payments and orders properly
4. ✅ Send order confirmation emails

### Troubleshooting

If you still see the "Could not load the default credentials" error:

1. **Check Environment Variables**: Make sure all 4 variables are set correctly
2. **Check Private Key Format**: Ensure the private key includes the `\n` characters
3. **Redeploy**: Environment variables only take effect after a new deployment
4. **Check Vercel Logs**: Go to your deployment → Functions → View Function Logs

### Alternative: Use Vercel CLI

You can also set environment variables using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add FIREBASE_PRIVATE_KEY
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY_ID
vercel env add FIREBASE_CLIENT_ID

# Redeploy
vercel --prod
```

### Security Notes

- Never commit the Firebase service account JSON file to your repository
- The environment variables are encrypted in Vercel
- Only team members with access to your Vercel project can see these variables

## Email Configuration (Optional)

If you want to send emails from Vercel, you'll also need to set up email service environment variables:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `SENDGRID_API_KEY` | SendGrid API key for sending emails | `SG.xxxxx` |
| `FROM_EMAIL` | Email address to send from | `noreply@cityroots.com` |

## Razorpay Configuration (Already Set)

Your Razorpay configuration should already be working since it uses API keys directly in the code. If you want to use environment variables for Razorpay too:

| Variable Name | Value |
|---------------|-------|
| `RAZORPAY_KEY_ID` | `rzp_test_RQwJgLfJAHNwut` |
| `RAZORPAY_KEY_SECRET` | `9acTi4K5w3mr3bWLmTvimF91` |

---

**After following these steps, your Vercel deployment should work perfectly!** 🚀
