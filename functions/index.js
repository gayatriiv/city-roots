/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from City Roots API!' });
});

// Plants endpoints
app.get('/api/plants', async (req, res) => {
  try {
    // Return some static data for now
    // Later you can connect to Firestore
    const plants = [
      { id: 1, name: 'Snake Plant', price: 1200, category: 'indoor' },
      { id: 2, name: 'Peace Lily', price: 1500, category: 'flowering' },
      { id: 3, name: 'Monstera', price: 2200, category: 'indoor' }
    ];
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seeds endpoints
app.get('/api/seeds', async (req, res) => {
  try {
    const seeds = [
      { id: 1, name: 'Tomato Seeds', price: 150, category: 'vegetables' },
      { id: 2, name: 'Basil Seeds', price: 120, category: 'herbs' },
      { id: 3, name: 'Marigold Seeds', price: 100, category: 'flowers' }
    ];
    res.json(seeds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the API as a Firebase function
exports.api = functions.https.onRequest(app);
