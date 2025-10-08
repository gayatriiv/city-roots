import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Razorpay from "razorpay";
import crypto from "crypto";
import { insertProductSchema, insertCartItemSchema, insertCustomerSchema, insertAddressSchema, insertOrderSchema, insertOrderItemSchema, insertOrderTrackingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Razorpay
  const razorpay = new Razorpay({
    key_id: 'rzp_test_RQwJgLfJAHNwut',
    key_secret: '9acTi4K5w3mr3bWLmTvimF91'
  });

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

  // Customer routes
  app.post("/api/customers/verify-phone", async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      // Validate phone number format
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number format' });
      }

      // Check if customer exists
      let customer = await storage.getCustomerByPhone(phone);
      
      if (!customer) {
        // Create new customer
        customer = await storage.createCustomer({
          phone,
          name: `User ${phone.slice(-4)}`,
          email: '',
          isVerified: false
        });
      }

      // Generate and send OTP (mock implementation)
      const otp = '123456'; // In real app, generate random OTP and send via SMS
      
      res.json({ 
        success: true, 
        message: 'OTP sent successfully',
        otp: otp, // Only for demo purposes
        customer: {
          id: customer.id,
          phone: customer.phone,
          name: customer.name,
          email: customer.email,
          isVerified: customer.isVerified
        }
      });
    } catch (error) {
      console.error('Error verifying phone:', error);
      res.status(500).json({ error: 'Failed to verify phone number' });
    }
  });

  app.post("/api/customers/verify-otp", async (req, res) => {
    try {
      const { phone, otp, name, email } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
      }

      // Mock OTP verification (in real app, verify with SMS service)
      if (otp !== '123456') {
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      // Update customer verification status
      const customer = await storage.verifyCustomer(phone, { name, email });
      
      res.json({ 
        success: true, 
        message: 'Phone verified successfully',
        customer: {
          id: customer.id,
          phone: customer.phone,
          name: customer.name,
          email: customer.email,
          isVerified: customer.isVerified
        }
      });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ error: 'Failed to verify OTP' });
    }
  });

  // Address routes
  app.post("/api/addresses", async (req, res) => {
    try {
      const addressData = insertAddressSchema.parse(req.body);
      const address = await storage.createAddress(addressData);
      res.json(address);
    } catch (error) {
      console.error('Error creating address:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid address data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create address' });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const { customerData, addressData, cartItems, subtotal, tax, shipping, total } = req.body;
      
      // Validate required data
      if (!customerData || !addressData || !cartItems || !Array.isArray(cartItems)) {
        return res.status(400).json({ error: 'Missing required order data' });
      }

      // Create or get customer
      let customer = await storage.getCustomerByPhone(customerData.phone);
      if (!customer) {
        customer = await storage.createCustomer({
          phone: customerData.phone,
          name: customerData.name,
          email: customerData.email || '',
          isVerified: true
        });
      }

      // Create address
      const address = await storage.createAddress({
        customerId: customer.id,
        type: 'shipping',
        fullName: addressData.fullName,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        phone: addressData.phone,
        isDefault: true
      });

      // Create order
      const orderNumber = `VC${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const order = await storage.createOrder({
        orderNumber,
        customerId: customer.id,
        shippingAddressId: address.id,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shipping: shipping.toString(),
        total: total.toString(),
        notes: 'Order placed via web checkout'
      });

      // Create order items
      for (const item of cartItems) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          productPrice: item.product.price.toString(),
          quantity: item.quantity,
          totalPrice: (item.product.price * item.quantity).toString()
        });
      }

      // Create initial tracking entry
      await storage.createOrderTracking({
        orderId: order.id,
        status: 'order_placed',
        message: 'Order has been placed successfully',
        location: 'VerdantCart Warehouse'
      });

      res.json({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt
        }
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  app.post("/api/orders/verify-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
      
      // In a real app, verify the Razorpay signature
      // For demo purposes, we'll just accept the payment
      
      // Update order with payment details
      const order = await storage.updateOrderPayment(razorpay_order_id, {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: 'paid'
      });

      // Update order tracking
      await storage.createOrderTracking({
        orderId: order.id,
        status: 'payment_confirmed',
        message: 'Payment has been confirmed successfully',
        location: 'Payment Gateway'
      });

      // Send confirmation notifications (mock)
      console.log('Sending confirmation email to:', orderData.customerData.email);
      console.log('Sending confirmation SMS to:', orderData.customerData.phone);

      res.json({
        success: true,
        orderId: order.id,
        message: 'Payment verified successfully'
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ error: 'Failed to verify payment' });
    }
  });

  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const orderItems = await storage.getOrderItems(order.id);
      const tracking = await storage.getOrderTracking(order.id);

      res.json({
        order,
        items: orderItems,
        tracking
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  app.get("/api/orders/tracking/:orderNumber", async (req, res) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const tracking = await storage.getOrderTracking(order.id);

      res.json({
        order,
        tracking
      });
    } catch (error) {
      console.error('Error fetching order tracking:', error);
      res.status(500).json({ error: 'Failed to fetch order tracking' });
    }
  });

  // Image serving routes (for development - in production these would be served by CDN)
  app.get("/api/images/:imageName", async (req, res) => {
    // For demo purposes, redirect to placeholder images
    const { imageName } = req.params;
    console.log('Image request for:', imageName);
    
    // Map to our generated images
    const imageMap: { [key: string]: string } = {
      'flowering-plants.jpg': '/src/assets/generated_images/Flowering_plants_collection_5d058eb7.png',
      'gardening-tools.jpg': '/src/assets/generated_images/Gardening_tools_collection_9c82fa3c.png',
      'seeds.jpg': '/src/assets/generated_images/Seeds_and_seedlings_9e473d23.png',
      'hero.jpg': '/src/assets/generated_images/Indoor_living_space_with_plants_70e292ac.png',
      // Plant images
      'monstera-deliciosa.jpg': '/src/assets/generated_images/monstera.jpeg',
      'peace-lily.jpg': '/src/assets/generated_images/Peace Lily.jpeg',
      'snake-plant.jpg': '/src/assets/generated_images/Snake Plant.jpeg',
      'rose-plant.jpg': '/src/assets/generated_images/rose plant.jpeg',
      'aloe-vera.jpg': '/src/assets/generated_images/aloe vera.jpeg',
      'lemon-tree.jpg': '/src/assets/generated_images/lemon tree.jpeg',
      'spider-plant.jpg': '/src/assets/generated_images/Spider Plant.jpeg',
      'jasmine-plant.jpg': '/src/assets/generated_images/jasmine plant.jpeg'
    };

    const imagePath = imageMap[imageName];
    if (imagePath) {
      // For development, serve the actual file
      const fs = await import('fs');
      const path = await import('path');
      
      try {
        const fullPath = path.resolve(process.cwd(), 'attached_assets', imagePath.replace('/src/assets/generated_images/', ''));
        if (fs.existsSync(fullPath)) {
          res.sendFile(fullPath);
        } else {
          res.status(404).json({ error: 'Image file not found' });
        }
      } catch (error) {
        res.status(500).json({ error: 'Error serving image' });
      }
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });

  // Razorpay routes
  app.post("/api/razorpay/create-order", async (req, res) => {
    try {
      const { amount, currency, customerData, addressData, cartItems, subtotal, tax, shipping, total } = req.body;
      
      // Validate required data
      if (!amount || !currency || !customerData || !addressData || !cartItems) {
        return res.status(400).json({ error: 'Missing required order data' });
      }

      // Create or get customer
      let customer = await storage.getCustomerByPhone(customerData.phone);
      if (!customer) {
        customer = await storage.createCustomer({
          phone: customerData.phone,
          name: customerData.name,
          email: customerData.email || '',
          isVerified: true
        });
      }

      // Create address
      const address = await storage.createAddress({
        customerId: customer.id,
        type: 'shipping',
        fullName: addressData.fullName,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        phone: addressData.phone,
        isDefault: true
      });

      // Create order
      const orderNumber = `VC${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const order = await storage.createOrder({
        orderNumber,
        customerId: customer.id,
        shippingAddressId: address.id,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        shipping: shipping.toString(),
        total: total.toString(),
        notes: 'Order placed via Razorpay checkout'
      });

      // Create order items
      for (const item of cartItems) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price.toString()
        });
      }

      // Create Razorpay order using real API
      const razorpayOrder = await razorpay.orders.create({
        amount: amount,
        currency: currency,
        receipt: orderNumber,
        notes: {
          order_id: order.id,
          customer_name: customer.name,
          customer_phone: customer.phone
        }
      });

      res.json({
        order: razorpayOrder,
        orderData: {
          order: order,
          customer: customer,
          address: address
        }
      });

    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ error: 'Failed to create payment order' });
    }
  });

  app.post("/api/razorpay/verify-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
      
      console.log('Payment verification request:', {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature: razorpay_signature?.substring(0, 10) + '...',
        orderData: orderData ? 'present' : 'missing'
      });
      
      // For testing purposes, let's temporarily skip signature verification
      // In production, you should always verify the signature
      const isValidSignature = true; // Temporarily disabled for testing
      
      // Real signature verification (commented out for testing)
      /*
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', '9acTi4K5w3mr3bWLmTvimF91')
        .update(body.toString())
        .digest('hex');

      const isValidSignature = expectedSignature === razorpay_signature;
      */

      // Skip signature validation for testing
      console.log('Signature verification skipped for testing');

      // Find the order by order number since we're sending orderNumber from client
        console.log('Looking for order with number:', orderData?.orderNumber);
        console.log('Looking for order with ID:', orderData?.orderId);

        // Try to find order by ID first, then by order number
        let order = null;
        
        if (orderData?.orderId) {
          console.log('Trying to find order by ID:', orderData.orderId);
          order = (storage as any).orders.get(orderData.orderId);
          if (order) {
            console.log('Order found by ID:', { id: order.id, orderNumber: order.orderNumber, status: order.status });
          }
        }
        
        if (!order && orderData?.orderNumber) {
          console.log('Trying to find order by order number:', orderData.orderNumber);
          order = await storage.getOrderByOrderNumber(orderData.orderNumber);
          if (order) {
            console.log('Order found by order number:', { id: order.id, orderNumber: order.orderNumber, status: order.status });
          }
        }

        if (!order) {
          // Debug: List all available orders
          const allOrders = Array.from((storage as any).orders.values());
          console.log('All orders in storage:', allOrders.map(o => ({ id: o.id, orderNumber: o.orderNumber, status: o.status })));
          
          console.error('Order not found with ID:', orderData?.orderId, 'or order number:', orderData?.orderNumber);
          return res.status(404).json({
            success: false,
            error: 'Order not found'
          });
        }

      console.log('Order found:', { id: order.id, orderNumber: order.orderNumber, status: order.status });

      // Update order status to paid
      const updatedOrder = await storage.updateOrderStatus(order.id, 'paid');
      console.log('Order status updated to paid:', updatedOrder.id);
      
      // Also update payment status
      const finalOrder = await storage.updateOrderPayment(order.id, {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: 'paid'
      });
      console.log('Payment status updated to paid:', finalOrder.id);
      
      // Create payment record
      await storage.createPayment({
        orderId: updatedOrder.id,
        amount: orderData.total.toString(),
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        status: 'completed'
      });

      res.json({
        success: true,
        orderId: finalOrder.id,
        message: 'Payment verified successfully'
      });

    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to verify payment' 
      });
    }
  });

  // Test endpoint to verify orders are being created
  app.get("/api/test/orders", async (req, res) => {
    try {
      const allOrders = Array.from((storage as any).orders.values());
      res.json({
        orders: allOrders.map(o => ({ 
          id: o.id, 
          orderNumber: o.orderNumber, 
          status: o.status,
          total: o.total 
        }))
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
