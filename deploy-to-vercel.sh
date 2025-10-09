#!/bin/bash

# VerdantCart Vercel Deployment Script
echo "🚀 VerdantCart Vercel Deployment Script"
echo "========================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

echo "📦 Building project..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. See VERCEL_ENVIRONMENT_VARIABLES.md for required variables"
echo "3. Redeploy after setting environment variables"

