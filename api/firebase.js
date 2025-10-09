// Simplified Firebase configuration for Vercel
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db = null;
let isInitialized = false;
let initializationError = null;

function initializeFirebase() {
  if (isInitialized) return db;
  
  try {
    console.log('🔧 Starting Firebase initialization...');
    console.log('Environment variables check:', {
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKeyId: !!process.env.FIREBASE_PRIVATE_KEY_ID,
      hasClientId: !!process.env.FIREBASE_CLIENT_ID
    });

    if (getApps().length === 0) {
      // Check for Vercel environment variables
      if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        console.log('🔑 Using Vercel environment variables for Firebase');
        
        // Clean the private key more thoroughly
        let cleanPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
        
        // Remove any surrounding quotes
        cleanPrivateKey = cleanPrivateKey.replace(/^"(.*)"$/, '$1');
        cleanPrivateKey = cleanPrivateKey.replace(/^'(.*)'$/, '$1');
        
        // Replace escaped newlines with actual newlines
        cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');
        
        // If the key doesn't start with BEGIN, it's likely the raw key content
        if (!cleanPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
          // Split the key content and reformat it properly
          const keyContent = cleanPrivateKey.replace(/\s/g, ''); // Remove all whitespace
          // Add line breaks every 64 characters and wrap with PEM markers
          const formattedKey = keyContent.match(/.{1,64}/g).join('\n');
          cleanPrivateKey = `-----BEGIN PRIVATE KEY-----\n${formattedKey}\n-----END PRIVATE KEY-----`;
        }
        
        // Ensure it ends properly
        if (!cleanPrivateKey.includes('-----END PRIVATE KEY-----')) {
          cleanPrivateKey = cleanPrivateKey + '\n-----END PRIVATE KEY-----';
        }
        
        console.log('Private key length:', cleanPrivateKey.length);
        console.log('Cleaned private key preview:', cleanPrivateKey.substring(0, 100) + '...');
        
        const serviceAccount = {
          type: "service_account",
          project_id: "city-roots",
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "",
          private_key: cleanPrivateKey,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID || "",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
        };
        
        console.log('🔧 Creating Firebase app...');
        const app = initializeApp({
          credential: cert(serviceAccount),
          projectId: "city-roots"
        });
        
        console.log('🔧 Getting Firestore...');
        db = getFirestore(app);
        
        // Test the connection
        console.log('🔧 Testing Firestore connection...');
        // We'll test this in a simple way by just checking if we can access the db
        if (db) {
          console.log('✅ Firebase Admin initialized successfully');
        } else {
          throw new Error('Failed to get Firestore instance');
        }
      } else {
        console.log('⚠️ Firebase environment variables not found, using fallback');
        db = null;
      }
    } else {
      console.log('🔧 Using existing Firebase app...');
      db = getFirestore(getApps()[0]);
      console.log('✅ Using existing Firebase app');
    }
    
    isInitialized = true;
    initializationError = null;
    return db;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    initializationError = error;
    db = null;
    isInitialized = true;
    return null;
  }
}

// Export a function to get the database
export function getDatabase() {
  if (!isInitialized) {
    return initializeFirebase();
  }
  return db;
}

// Export error information
export function getInitializationError() {
  return initializationError;
}

export { db };
