import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCartItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, search } = req.query;
      
      if (search) {
        const products = await storage.searchProducts(search as string);
        return res.json(products);
      }
      
      if (category) {
        const products = await storage.getProductsByCategory(category as string);
        return res.json(products);
      }
      
      if (featured === 'true') {
        const products = await storage.getFeaturedProducts();
        return res.json(products);
      }
      
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  // Product creation removed for security - admin interface would be separate

  // Cart routes
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const cartItems = await storage.getCartItems(req.params.sessionId);
      res.json(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  });

  app.post("/api/cart/:sessionId/add", async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;
      
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }

      // Validate quantity
      if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ error: 'Quantity must be a whole number between 1 and 99' });
      }

      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (!product.inStock) {
        return res.status(400).json({ error: 'Product is out of stock' });
      }

      const cartItem = await storage.addToCart(req.params.sessionId, productId, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Failed to add to cart' });
    }
  });

  app.put("/api/cart/:sessionId/update", async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      
      if (!productId || quantity === undefined) {
        return res.status(400).json({ error: 'Product ID and quantity are required' });
      }

      // Validate quantity
      if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
        return res.status(400).json({ error: 'Quantity must be a whole number' });
      }

      if (quantity <= 0) {
        await storage.removeFromCart(req.params.sessionId, productId);
        return res.json({ success: true, message: 'Item removed from cart' });
      }

      if (quantity > 99) {
        return res.status(400).json({ error: 'Quantity cannot exceed 99' });
      }

      const cartItem = await storage.updateCartItemQuantity(req.params.sessionId, productId, quantity);
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      
      res.json(cartItem);
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ error: 'Failed to update cart' });
    }
  });

  app.delete("/api/cart/:sessionId/remove/:productId", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.sessionId, req.params.productId);
      if (!success) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ error: 'Failed to remove from cart' });
    }
  });

  app.delete("/api/cart/:sessionId/clear", async (req, res) => {
    try {
      await storage.clearCart(req.params.sessionId);
      res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  });

  // Guide routes
  app.get("/api/guides", async (req, res) => {
    try {
      const { category, featured } = req.query;
      
      if (category) {
        const guides = await storage.getGuidesByCategory(category as string);
        return res.json(guides);
      }
      
      if (featured === 'true') {
        const guides = await storage.getFeaturedGuides();
        return res.json(guides);
      }
      
      const guides = await storage.getAllGuides();
      res.json(guides);
    } catch (error) {
      console.error('Error fetching guides:', error);
      res.status(500).json({ error: 'Failed to fetch guides' });
    }
  });

  app.get("/api/guides/:id", async (req, res) => {
    try {
      const guide = await storage.getGuide(req.params.id);
      if (!guide) {
        return res.status(404).json({ error: 'Guide not found' });
      }
      res.json(guide);
    } catch (error) {
      console.error('Error fetching guide:', error);
      res.status(500).json({ error: 'Failed to fetch guide' });
    }
  });

  // Image serving routes (for development - in production these would be served by CDN)
  app.get("/api/images/:imageName", (req, res) => {
    // For demo purposes, redirect to placeholder images
    const { imageName } = req.params;
    
    // Map to our generated images
    const imageMap: { [key: string]: string } = {
      'flowering-plants.jpg': '/src/assets/generated_images/Flowering_plants_collection_5d058eb7.png',
      'gardening-tools.jpg': '/src/assets/generated_images/Gardening_tools_collection_9c82fa3c.png',
      'seeds.jpg': '/src/assets/generated_images/Seeds_and_seedlings_9e473d23.png',
      'hero.jpg': '/src/assets/generated_images/Indoor_living_space_with_plants_70e292ac.png'
    };

    const imagePath = imageMap[imageName];
    if (imagePath) {
      // For development, we'll return a JSON with the path for the frontend to use
      res.json({ imagePath });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
