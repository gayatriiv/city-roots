# Complete Vercel Deployment Guide for VerdantCart

This guide will walk you through deploying your VerdantCart e-commerce application to Vercel properly.

## 🚀 Quick Start

1. **Set up environment variables** (see [VERCEL_ENVIRONMENT_VARIABLES.md](./VERCEL_ENVIRONMENT_VARIABLES.md))
2. **Deploy to Vercel** using the steps below
3. **Verify deployment** is working correctly

## 📋 Prerequisites

- [Vercel account](https://vercel.com/signup)
- [GitHub repository](https://github.com) with your VerdantCart code
- Firebase project set up (already configured)

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Repository

Make sure your repository contains:
- ✅ `vercel.json` (already created)
- ✅ `package.json` with proper build scripts
- ✅ Firebase service account JSON file (for reference, but don't commit it)

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Node.js project

### Step 3: Configure Build Settings

Vercel should auto-detect these settings from your `vercel.json`:

- **Framework Preset**: Other
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### Step 4: Set Environment Variables

**CRITICAL**: You must set these environment variables before deploying:

1. Go to your project settings in Vercel
2. Navigate to **Environment Variables**
3. Add the following variables (see [VERCEL_ENVIRONMENT_VARIABLES.md](./VERCEL_ENVIRONMENT_VARIABLES.md) for exact values):

#### Required Firebase Variables:
```
FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJwZOKJTMRr2bD\nMC+zPZdb3uxT1/nYtRIIv/qzXOVx7A5vo3v1CmKPBjCksniQxaQshvNh+Jot57Yf\nGionv6ZjZ0KEU8a0M0nZRSTJNQah0z5zzErEhK/l+kV6GDZJdaQ+6IevmzVVJdQS\nK6+F+Gh6s6ulGJ/ObAtiVrxrflSN3gccZ0Tkzw57r6j3vS5/bmBYJjzUMKZKzGrO\nlJnSX6sTKPj4LBRpBlCBu81sGIC/kJPRJKQTTGZ5mwLGF99VSAglCoLRF/WvX1bA\nUCZbRMZzRLmXWY3gtFJddAZ0EapYMXDaliRjEWwNxVYzwoc3Sxu2v8dCH1pyoUvM\nyKBInueDAgMBAAECggEAAs31DhOMTS+h/w6ZayVtCDLmGBhFedSyhnqcsoeVDOta\nHAUqwPI/Anv0iyWL9X851ACgO3loM0EoT/BeK6VHW9RgoVREy9Z2rVV/uGhLSk6U\nbKmnVGn/w/OhqZvSjVzcRp+W20MOD7vx4brHutYEJch/l1DrT8RCuEA6aEgeRsaM\nAmC1iCEVzKzB7ch5NCu8lm7URRl3d9eQTngOZoaoQRB6hx5DICg1RS3azzYmJuv7\n5fKNbUkC2aRRc0XPkWWPJOn6TXSE7fgZQOfXX4e+EIY7byFrR2vg1WS7T9fC91dG\nG3gNoQW9WcL0dehQYycabMruueXX7+siVhr9/CDBeQKBgQDq7dInNuEMbzdwqWrX\nN/eIqT89OzwyRzZ+bf1Xx4GORordEWKHEo2I2GXllWKmKzNjgURdXmELUvPsxqLU\nrxPp+QNVqv3JsM+7yaZK6q8ZX0esumAJE7lYjogyYrxHzvnuhGH0+BvG2WKTo59l\nSdrhdIAWTNXpMS0YH65//W1d/wKBgQDb2hPgdvWdg74Fkn52kjrGNoNSy+RGr0YT\nJcICFu9Q3UW0mmlg0gW6EG5bUK4qFd8Q27E+CoEYpi8Rnd+W0JmxAdef9dGQLXtP\nXuQ6mQSCAjOT7VCESJSd13lCV9irkdxWAmr0Ymz4PiKgmXlR2VlNrX593K3PLgtQ\nRZkeAwv+fQKBgQCudnBzeLjGAC2+t8HFFCX6Uh3JfhzlBad9WnciYeFfZBmptEhk\nIK4E6xc42KhK2JgwFAZOBFGzFCZbNuQjZ+U1Axyr2PDhgDG0tjqNNh1UjUJwDnRV\nKVWiYy7XpCVIend23s7UGhCeqj8ffwpXMPKgLWEVrnfI1iEz4gs3t18pxwKBgDQL\nKc1nG7mP6Dm1dg5ni1ZErU26Sm2ZLEN4GrcX6sr/tnKMYwmybfyfyx/+t1vrFYUO\nHKUNI4ZMQLQw5S70bo2CXCLXtCYnPhuJ4QkmE/UaxE7uTLMj41qCGYhk9zuWKcyK\ngfscGaOiQdw2uItxojxLJ7hvtw1mXvM/poF+QyaZAoGAX3uBXunBMJZBOiVA984e\nkg0i3PbmhmYsRTba5l+YzzcL0aNba+6HVAnxJUVAsbf2061kgilEfE/VCRuow2BJ\nUkJMzCOVKhY83Ba+l1YcJT2rQd0JRN8ElEcVEtEzC+Y6CQmm0c8pom1nHUAorHlO\nlWoWX6DGXmDuoxHrZhyhZGs=\n-----END PRIVATE KEY-----\n

FIREBASE_CLIENT_EMAIL = firebase-adminsdk-fbsvc@city-roots.iam.gserviceaccount.com

FIREBASE_PRIVATE_KEY_ID = 4497871cfa8d412b2810e5693e8fd9732f520474

FIREBASE_CLIENT_ID = 115651779549934630932
```

#### Optional Variables:
```
SESSION_SECRET = your-secret-session-key-here
```

**Important**: 
- Select **Production**, **Preview**, and **Development** for all variables
- Copy the Firebase private key EXACTLY as shown, including all `\n` characters

### Step 5: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete (usually 2-5 minutes)
3. Check the deployment logs for any errors

### Step 6: Verify Deployment

After deployment, you should see:

1. **✅ Successful Build**: No build errors in Vercel logs
2. **✅ Firebase Connection**: Check function logs for:
   ```
   🔑 Using Vercel environment variables for Firebase
   ✅ Firebase Admin initialized successfully
   ✅ Using Firebase Firestore storage
   ```
3. **✅ Application Loads**: Visit your Vercel URL and verify:
   - Homepage loads correctly
   - Products display
   - Cart functionality works
   - API endpoints respond

## 🔍 Troubleshooting

### Build Failures

**Problem**: Build fails with module not found errors
**Solution**: 
- Check that all dependencies are in `package.json`
- Ensure `vercel.json` is properly configured
- Try running `npm install` locally to verify dependencies

**Problem**: TypeScript compilation errors
**Solution**:
- Run `npm run check` locally to identify issues
- Fix TypeScript errors before deploying

### Runtime Errors

**Problem**: "Could not load the default credentials" error
**Solution**:
- Verify all 4 Firebase environment variables are set
- Check that the private key includes `\n` characters
- Redeploy after fixing environment variables

**Problem**: API routes return 404
**Solution**:
- Check `vercel.json` routing configuration
- Verify server functions are building correctly
- Check function logs in Vercel dashboard

**Problem**: Static assets not loading
**Solution**:
- Verify `dist/public` directory contains built assets
- Check that `/@assets` route is properly configured
- Ensure Vite build is generating assets correctly

### Performance Issues

**Problem**: Slow loading times
**Solution**:
- Check function logs for cold start times
- Optimize bundle size by removing unused dependencies
- Consider upgrading Vercel plan for better performance

## 🎯 Post-Deployment Checklist

- [ ] Application loads at your Vercel URL
- [ ] Firebase connection established (check logs)
- [ ] Products display correctly
- [ ] Shopping cart works
- [ ] API endpoints respond
- [ ] Static assets load (images, CSS)
- [ ] No console errors in browser
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable

## 🔄 Future Deployments

After initial setup, deployments are automatic:

1. **Push to main branch** → Triggers production deployment
2. **Push to other branches** → Triggers preview deployment
3. **Pull requests** → Creates preview deployments for testing

## 📞 Support

If you encounter issues:

1. **Check Vercel Logs**: Go to your deployment → Functions → View Function Logs
2. **Check Build Logs**: Go to your deployment → View Build Logs
3. **Verify Environment Variables**: Ensure all required variables are set
4. **Test Locally**: Run `npm run dev` to test locally first

## 🎉 Success!

Once deployed successfully, your VerdantCart application will be live at:
`https://your-project-name.vercel.app`

The application includes:
- ✅ Full e-commerce functionality
- ✅ Firebase database integration
- ✅ Shopping cart management
- ✅ Product catalog
- ✅ Responsive design
- ✅ Payment integration (Razorpay/Stripe ready)

Enjoy your live e-commerce platform! 🚀

