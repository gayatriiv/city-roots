# Vercel Environment Variables Setup

This document outlines all the environment variables you need to set in your Vercel dashboard for the VerdantCart application to work properly.

## Required Environment Variables

### Firebase Admin SDK (Required for Database & Authentication)
Set these in your Vercel dashboard under **Settings** → **Environment Variables**:

| Variable Name | Value | Description | Environment |
|---------------|-------|-------------|-------------|
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJwZOKJTMRr2bD\nMC+zPZdb3uxT1/nYtRIIv/qzXOVx7A5vo3v1CmKPBjCksniQxaQshvNh+Jot57Yf\nGionv6ZjZ0KEU8a0M0nZRSTJNQah0z5zzErEhK/l+kV6GDZJdaQ+6IevmzVVJdQS\nK6+F+Gh6s6ulGJ/ObAtiVrxrflSN3gccZ0Tkzw57r6j3vS5/bmBYJjzUMKZKzGrO\nlJnSX6sTKPj4LBRpBlCBu81sGIC/kJPRJKQTTGZ5mwLGF99VSAglCoLRF/WvX1bA\nUCZbRMZzRLmXWY3gtFJddAZ0EapYMXDaliRjEWwNxVYzwoc3Sxu2v8dCH1pyoUvM\nyKBInueDAgMBAAECggEAAs31DhOMTS+h/w6ZayVtCDLmGBhFedSyhnqcsoeVDOta\nHAUqwPI/Anv0iyWL9X851ACgO3loM0EoT/BeK6VHW9RgoVREy9Z2rVV/uGhLSk6U\nbKmnVGn/w/OhqZvSjVzcRp+W20MOD7vx4brHutYEJch/l1DrT8RCuEA6aEgeRsaM\nAmC1iCEVzKzB7ch5NCu8lm7URRl3d9eQTngOZoaoQRB6hx5DICg1RS3azzYmJuv7\n5fKNbUkC2aRRc0XPkWWPJOn6TXSE7fgZQOfXX4e+EIY7byFrR2vg1WS7T9fC91dG\nG3gNoQW9WcL0dehQYycabMruueXX7+siVhr9/CDBeQKBgQDq7dInNuEMbzdwqWrX\nN/eIqT89OzwyRzZ+bf1Xx4GORordEWKHEo2I2GXllWKmKzNjgURdXmELUvPsxqLU\nrxPp+QNVqv3JsM+7yaZK6q8ZX0esumAJE7lYjogyYrxHzvnuhGH0+BvG2WKTo59l\nSdrhdIAWTNXpMS0YH65//W1d/wKBgQDb2hPgdvWdg74Fkn52kjrGNoNSy+RGr0YT\nJcICFu9Q3UW0mmlg0gW6EG5bUK4qFd8Q27E+CoEYpi8Rnd+W0JmxAdef9dGQLXtP\nXuQ6mQSCAjOT7VCESJSd13lCV9irkdxWAmr0Ymz4PiKgmXlR2VlNrX593K3PLgtQ\nRZkeAwv+fQKBgQCudnBzeLjGAC2+t8HFFCX6Uh3JfhzlBad9WnciYeFfZBmptEhk\nIK4E6xc42KhK2JgwFAZOBFGzFCZbNuQjZ+U1Axyr2PDhgDG0tjqNNh1UjUJwDnRV\nKVWiYy7XpCVIend23s7UGhCeqj8ffwpXMPKgLWEVrnfI1iEz4gs3t18pxwKBgDQL\nKc1nG7mP6Dm1dg5ni1ZErU26Sm2ZLEN4GrcX6sr/tnKMYwmybfyfyx/+t1vrFYUO\nHKUNI4ZMQLQw5S70bo2CXCLXtCYnPhuJ4QkmE/UaxE7uTLMj41qCGYhk9zuWKcyK\ngfscGaOiQdw2uItxojxLJ7hvtw1mXvM/poF+QyaZAoGAX3uBXunBMJZBOiVA984e\nkg0i3PbmhmYsRTba5l+YzzcL0aNba+6HVAnxJUVAsbf2061kgilEfE/VCRuow2BJ\nUkJMzCOVKhY83Ba+l1YcJT2rQd0JRN8ElEcVEtEzC+Y6CQmm0c8pom1nHUAorHlO\nlWoWX6DGXmDuoxHrZhyhZGs=\n-----END PRIVATE KEY-----\n` | Firebase private key (from service account JSON) | Production, Preview, Development |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@city-roots.iam.gserviceaccount.com` | Firebase client email | Production, Preview, Development |
| `FIREBASE_PRIVATE_KEY_ID` | `4497871cfa8d412b2810e5693e8fd9732f520474` | Firebase private key ID | Production, Preview, Development |
| `FIREBASE_CLIENT_ID` | `115651779549934630932` | Firebase client ID | Production, Preview, Development |

### Session Configuration (Optional but Recommended)
| Variable Name | Value | Description | Environment |
|---------------|-------|-------------|-------------|
| `SESSION_SECRET` | `your-secret-session-key-here` | Secret for session management | Production, Preview, Development |

### Database Configuration (Optional - Firebase handles this)
| Variable Name | Value | Description | Environment |
|---------------|-------|-------------|-------------|
| `DATABASE_URL` | `your-neon-postgresql-url` | PostgreSQL database URL (if using Drizzle instead of Firebase) | Production, Preview, Development |

### Email Configuration (Optional)
| Variable Name | Value | Description | Environment |
|---------------|-------|-------------|-------------|
| `SENDGRID_API_KEY` | `SG.your-sendgrid-api-key` | SendGrid API key for sending emails | Production, Preview, Development |
| `FROM_EMAIL` | `noreply@yourdomain.com` | Email address to send emails from | Production, Preview, Development |

### Payment Configuration (Already configured in code)
The application already has Razorpay and Stripe configurations in the code. If you want to use environment variables instead:

| Variable Name | Value | Description | Environment |
|---------------|-------|-------------|-------------|
| `RAZORPAY_KEY_ID` | `rzp_test_RQwJgLfJAHNwut` | Razorpay key ID | Production, Preview, Development |
| `RAZORPAY_KEY_SECRET` | `9acTi4K5w3mr3bWLmTvimF91` | Razorpay key secret | Production, Preview, Development |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_your-stripe-publishable-key` | Stripe publishable key | Production, Preview, Development |
| `STRIPE_SECRET_KEY` | `sk_test_your-stripe-secret-key` | Stripe secret key | Production, Preview, Development |

## How to Set Environment Variables in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your VerdantCart project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter the Variable Name and Value
6. Select all environments (Production, Preview, Development)
7. Click **Save**
8. Repeat for each variable

## Important Notes

### Firebase Private Key
- **Copy the private key EXACTLY** as shown above, including the `\n` characters
- The private key should start with `-----BEGIN PRIVATE KEY-----\n` and end with `\n-----END PRIVATE KEY-----\n`
- Make sure to include all the `\n` characters - they are important for proper formatting

### Environment Selection
- Always select **Production**, **Preview**, and **Development** for each variable
- This ensures the variables are available in all deployment environments

### Security
- Never commit the Firebase service account JSON file to your repository
- Environment variables are encrypted in Vercel
- Only team members with access to your Vercel project can see these variables

## After Setting Variables

1. **Redeploy**: Environment variables only take effect after a new deployment
2. **Check Logs**: Go to your deployment → Functions → View Function Logs to verify Firebase initialization
3. **Test**: Verify that your application can connect to Firebase and database operations work

## Troubleshooting

If you see "Could not load the default credentials" error:
1. Check that all 4 Firebase variables are set correctly
2. Verify the private key format includes `\n` characters
3. Ensure all environments are selected for each variable
4. Redeploy after making changes

## Verification

After setting up the environment variables and redeploying, you should see these logs:
- `🔑 Using Vercel environment variables for Firebase`
- `✅ Firebase Admin initialized successfully`
- `✅ Using Firebase Firestore storage`

If you see fallback messages, double-check your environment variable setup.
