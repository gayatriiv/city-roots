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
      // Try to use service account key file
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
    } else {
      adminApp = getApps()[0];
    }
    adminDb = getFirestore(adminApp);
    console.log('✅ Firebase Admin initialized successfully');
    return true;
  } catch (error: any) {
    console.warn('⚠️ Firebase Admin initialization failed:', error.message);
    console.warn('⚠️ Falling back to in-memory storage. To use Firebase, set up authentication:');
    console.warn('   1. Go to Firebase Console > Project Settings > Service Accounts');
    console.warn('   2. Generate a new private key');
    console.warn('   3. Set GOOGLE_APPLICATION_CREDENTIALS environment variable');
    adminApp = null;
    adminDb = null;
    return false;
  }
}

// Initialize immediately
initializeFirebaseAdmin();

export { adminDb };
export default adminApp;
