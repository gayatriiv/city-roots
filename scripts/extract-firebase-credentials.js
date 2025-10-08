#!/usr/bin/env node

/**
 * Firebase Credentials Extractor
 * 
 * This script helps extract Firebase service account credentials
 * for setting up Vercel environment variables.
 * 
 * Usage: node scripts/extract-firebase-credentials.js path/to/service-account.json
 */

import fs from 'fs';
import path from 'path';

function extractCredentials(jsonFilePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(jsonFilePath)) {
      console.error('❌ Error: File not found:', jsonFilePath);
      console.log('\n📋 To get the service account JSON file:');
      console.log('   1. Go to Firebase Console → Project Settings → Service Accounts');
      console.log('   2. Click "Generate New Private Key"');
      console.log('   3. Download the JSON file');
      return;
    }

    // Read and parse the JSON file
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const credentials = JSON.parse(jsonContent);

    console.log('🔥 Firebase Service Account Credentials');
    console.log('=====================================\n');

    console.log('📋 Copy these values to your Vercel Environment Variables:\n');

    console.log('🔑 FIREBASE_PRIVATE_KEY:');
    console.log('─'.repeat(50));
    console.log(credentials.private_key);
    console.log('─'.repeat(50));

    console.log('\n📧 FIREBASE_CLIENT_EMAIL:');
    console.log('─'.repeat(50));
    console.log(credentials.client_email);
    console.log('─'.repeat(50));

    console.log('\n🆔 FIREBASE_PRIVATE_KEY_ID:');
    console.log('─'.repeat(50));
    console.log(credentials.private_key_id);
    console.log('─'.repeat(50));

    console.log('\n👤 FIREBASE_CLIENT_ID:');
    console.log('─'.repeat(50));
    console.log(credentials.client_id);
    console.log('─'.repeat(50));

    console.log('\n🚀 Next Steps:');
    console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.log('2. Add each of the above variables');
    console.log('3. Select all environments (Production, Preview, Development)');
    console.log('4. Redeploy your project');

    console.log('\n⚠️  Security Note:');
    console.log('Keep your service account JSON file secure and never commit it to Git!');

  } catch (error) {
    console.error('❌ Error reading credentials:', error.message);
    console.log('\nMake sure the file is a valid JSON file from Firebase Console.');
  }
}

// Get the file path from command line arguments
const jsonFilePath = process.argv[2];

if (!jsonFilePath) {
  console.log('🔥 Firebase Credentials Extractor');
  console.log('================================\n');
  console.log('Usage: node scripts/extract-firebase-credentials.js <path-to-service-account.json>');
  console.log('\nExample:');
  console.log('node scripts/extract-firebase-credentials.js ./city-roots-firebase-adminsdk-fbsvc-4497871cfa.json');
  process.exit(1);
}

extractCredentials(jsonFilePath);
