// Simple cart API endpoint
let cartItems = [];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({ items: cartItems });
  } else if (req.method === 'POST') {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Simple cart logic
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({
        id: Date.now().toString(),
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    res.status(200).json({ 
      message: 'Item added to cart',
      items: cartItems 
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

