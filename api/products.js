// Enhanced products API endpoint with Firebase integration
import { getDatabase } from './firebase.js';

// Fallback products if Firebase is not available
const fallbackProducts = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    description: "A beautiful tropical plant perfect for indoor spaces",
    price: "899",
    image: "/images/monstera.jpeg",
    category: "plants",
    featured: true,
    inStock: true
  },
  {
    id: "2", 
    name: "Snake Plant",
    description: "Low-maintenance plant that purifies air",
    price: "599",
    image: "/images/snake-plant.jpeg",
    category: "plants",
    featured: true,
    inStock: true
  },
  {
    id: "3",
    name: "Rose Seeds",
    description: "Premium rose seeds for beautiful flowering",
    price: "299",
    image: "/images/rose-seeds.jpg",
    category: "seeds",
    featured: false,
    inStock: true
  }
];

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { category } = req.query;
      const db = getDatabase();
      
      if (db) {
        // Use Firebase
        console.log('📦 Fetching products from Firebase');
        let query = db.collection('products');
        
        if (category) {
          query = query.where('category', '==', category);
        }
        
        const snapshot = await query.get();
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        res.status(200).json({ products });
      } else {
        // Use fallback data
        console.log('📦 Using fallback products data');
        let products = fallbackProducts;
        
        if (category) {
          products = products.filter(p => p.category === category);
        }
        
        res.status(200).json({ products });
      }
    } else if (req.method === 'POST') {
      // Add new product (admin functionality)
      const db = getDatabase();
      if (!db) {
        return res.status(503).json({ error: 'Database not available' });
      }
      
      const productData = req.body;
      const docRef = await db.collection('products').add({
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      res.status(201).json({ 
        message: 'Product added successfully',
        id: docRef.id 
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in products API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
