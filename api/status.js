// Status endpoint to check Firebase connection
import { getDatabase, getInitializationError } from './firebase.js';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const db = getDatabase();
    const error = getInitializationError();
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      firebase: {
        connected: !!db,
        hasEnvVars: !!(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL),
        error: error ? {
          message: error.message,
          name: error.name
        } : null
      },
      env: {
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKeyId: !!process.env.FIREBASE_PRIVATE_KEY_ID,
        hasClientId: !!process.env.FIREBASE_CLIENT_ID,
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.length : 0,
        privateKeyPreview: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.substring(0, 50) + '...' : 'N/A'
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
