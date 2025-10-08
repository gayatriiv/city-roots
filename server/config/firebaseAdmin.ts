import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// Firebase Admin configuration
const firebaseAdminConfig = {
  projectId: "city-roots",
  // Use service account key file if available
};

// Initialize Firebase Admin with error handling
let adminApp: App | null = null;
let adminDb: Firestore | null = null;

function initializeFirebaseAdmin() {
  try {
    if (getApps().length === 0) {
      // Check for Vercel environment variables first
      if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        console.log('🔑 Using Vercel environment variables for Firebase');
        const serviceAccount: any = {
          type: "service_account",
          project_id: "city-roots",
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "",
          private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID || "",
          auth_uri: "https://accounts.google.com/o/oauth2/auth",
          token_uri: "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
        };
        
        adminApp = initializeApp({
          credential: cert(serviceAccount),
          projectId: "city-roots"
        });
      } else {
        // Try to use service account key file (for local development)
        const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const defaultKeyPath = path.join(process.cwd(), 'city-roots-firebase-adminsdk-fbsvc-4497871cfa.json');
        
        if (serviceAccountPath) {
          console.log('🔑 Using service account key file:', serviceAccountPath);
          adminApp = initializeApp({
            credential: cert(serviceAccountPath),
            projectId: "city-roots"
          });
        } else if (fs.existsSync(defaultKeyPath)) {
          console.log('🔑 Using default service account key file:', defaultKeyPath);
          adminApp = initializeApp({
            credential: cert(defaultKeyPath),
            projectId: "city-roots"
          });
        } else {
          console.log('🔑 Using default credentials');
          adminApp = initializeApp(firebaseAdminConfig);
        }
      }
    } else {
      adminApp = getApps()[0];
    }
    adminDb = getFirestore(adminApp);
    console.log('✅ Firebase Admin initialized successfully');
    return true;
  } catch (error: any) {
    console.warn('⚠️ Firebase Admin initialization failed:', error.message);
    console.warn('⚠️ Falling back to in-memory storage. To use Firebase, set up authentication:');
    console.warn('   For Vercel: Set FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL environment variables');
    console.warn('   For Local: Set GOOGLE_APPLICATION_CREDENTIALS environment variable');
    adminApp = null;
    adminDb = null;
    return false;
  }
}

// Initialize immediately
initializeFirebaseAdmin();

export { adminDb };
export default adminApp;
