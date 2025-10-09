import { 
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Guide,
  type InsertGuide,
  type Customer,
  type InsertCustomer,
  type Address,
  type InsertAddress,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type OrderTracking,
  type InsertOrderTracking
} from "@shared/schema";
import { adminDb } from "../config/firebaseAdmin.js";
import { randomUUID } from "crypto";
import { IStorage } from "../storage.js";
import { Timestamp } from 'firebase-admin/firestore';

export class FirebaseStorage implements IStorage {
  private db = adminDb;

  constructor() {
    if (!this.db) {
      throw new Error('Firebase Admin not initialized. Please set up authentication credentials.');
    }
  }

  // Helper method to convert Firestore timestamps to Date objects and remove undefined values
  private convertTimestamps(data: any): any {
    if (!data) return data;
    const newData = { ...data };
    for (const key in newData) {
      if (newData[key] instanceof Timestamp) {
        newData[key] = newData[key].toDate();
      }
      // Remove undefined values to prevent Firestore errors
      if (newData[key] === undefined) {
        delete newData[key];
      }
    }
    return newData;
  }

  // Helper method to clean data before saving to Firestore
  private cleanDataForFirestore(data: any): any {
    if (!data) return data;
    const cleaned = { ...data };
    for (const key in cleaned) {
      if (cleaned[key] === undefined || cleaned[key] === null) {
        delete cleaned[key];
      }
    }
    return cleaned;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const doc = await this.db!.collection('users').doc(id).get();
    return doc.exists ? this.convertTimestamps(doc.data() as User) : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snapshot = await this.db!.collection('users').where('username', '==', username).get();
    if (snapshot.empty) return undefined;
    return this.convertTimestamps(snapshot.docs[0].data() as User);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    await this.db!.collection('users').doc(id).set(this.cleanDataForFirestore(user));
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    await this.db!.collection('users').doc(id).set(updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.db!.collection('users').doc(id).delete();
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    const snapshot = await this.db!.collection('products').get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as Product));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const doc = await this.db!.collection('products').doc(id).get();
    return doc.exists ? this.convertTimestamps(doc.data() as Product) : undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db!.collection('products').doc(id).set(this.cleanDataForFirestore(product));
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const product = await this.getProduct(id);
    if (!product) throw new Error('Product not found');
    
    const updatedProduct = { ...product, ...updates };
    await this.db!.collection('products').doc(id).set(updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.db!.collection('products').doc(id).delete();
      return true;
    } catch (error) {
      return false;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const snapshot = await this.db!.collection('products').where('category', '==', category).get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as Product));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const snapshot = await this.db!.collection('products').where('featured', '==', true).get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as Product));
  }

  async searchProducts(query: string): Promise<Product[]> {
    const snapshot = await this.db!.collection('products').get();
    const products = snapshot.docs.map(doc => this.convertTimestamps(doc.data() as Product));
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const snapshot = await this.db!.collection('cart').where('sessionId', '==', sessionId).get();
    const cartItems = snapshot.docs.map(doc => this.convertTimestamps(doc.data() as CartItem));
    
    // Fetch products for each cart item
    const cartItemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await this.getProduct(item.productId);
        return {
          ...item,
          product: product!
        };
      })
    );
    
    return cartItemsWithProducts;
  }

  async addToCart(sessionId: string, productId: string, quantity: number = 1): Promise<CartItem> {
    // Check if item already exists in cart
    const existingSnapshot = await this.db!.collection('cart')
      .where('sessionId', '==', sessionId)
      .where('productId', '==', productId)
      .get();
    
    if (!existingSnapshot.empty) {
      // Update existing item
      const existingDoc = existingSnapshot.docs[0];
      const existingItem = existingDoc.data() as CartItem;
      const updatedQuantity = existingItem.quantity + quantity;
      
      await existingDoc.ref.update({ quantity: updatedQuantity });
      return { ...existingItem, quantity: updatedQuantity };
    } else {
      // Create new item
      const id = randomUUID();
      const cartItem: CartItem = {
        id,
        sessionId,
        productId,
        quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await this.db!.collection('cart').doc(id).set(this.cleanDataForFirestore(cartItem));
      return cartItem;
    }
  }

  async updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<CartItem | undefined> {
    const snapshot = await this.db!.collection('cart')
      .where('sessionId', '==', sessionId)
      .where('productId', '==', productId)
      .get();
    
    if (snapshot.empty) return undefined;
    
    const doc = snapshot.docs[0];
    await doc.ref.update({ quantity, updatedAt: new Date() });
    return this.convertTimestamps({ ...doc.data(), quantity } as CartItem);
  }

  async removeFromCart(sessionId: string, productId: string): Promise<boolean> {
    const snapshot = await this.db!.collection('cart')
      .where('sessionId', '==', sessionId)
      .where('productId', '==', productId)
      .get();
    
    if (snapshot.empty) return false;
    
    await snapshot.docs[0].ref.delete();
    return true;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const snapshot = await this.db!.collection('cart').where('sessionId', '==', sessionId).get();
    if (snapshot.empty) return false;
    
    const batch = this.db!.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    return true;
  }

  // Guide methods
  async getAllGuides(): Promise<Guide[]> {
    const snapshot = await this.db!.collection('guides').get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as Guide));
  }

  async getGuide(id: string): Promise<Guide | undefined> {
    const doc = await this.db!.collection('guides').doc(id).get();
    return doc.exists ? this.convertTimestamps(doc.data() as Guide) : undefined;
  }

  async getFeaturedGuides(): Promise<Guide[]> {
    const snapshot = await this.db!.collection('guides').where('featured', '==', true).get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as Guide));
  }

  async getGuidesByCategory(category: string): Promise<Guide[]> {
    const snapshot = await this.db!.collection('guides').where('category', '==', category).get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as Guide));
  }

  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const id = randomUUID();
    const guide: Guide = { 
      ...insertGuide, 
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db!.collection('guides').doc(id).set(this.cleanDataForFirestore(guide));
    return guide;
  }

  async updateGuide(id: string, updates: Partial<Guide>): Promise<Guide> {
    const guide = await this.getGuide(id);
    if (!guide) throw new Error('Guide not found');
    
    const updatedGuide = { ...guide, ...updates };
    await this.db!.collection('guides').doc(id).set(updatedGuide);
    return updatedGuide;
  }

  async deleteGuide(id: string): Promise<void> {
    await this.db!.collection('guides').doc(id).delete();
  }

  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    const doc = await this.db!.collection('customers').doc(id).get();
    return doc.exists ? this.convertTimestamps(doc.data() as Customer) : undefined;
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    const snapshot = await this.db!.collection('customers').where('phone', '==', phone).get();
    if (snapshot.empty) return undefined;
    return this.convertTimestamps(snapshot.docs[0].data() as Customer);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      ...insertCustomer, 
      id,
      email: insertCustomer.email ?? null,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db!.collection('customers').doc(id).set(this.cleanDataForFirestore(customer));
    return customer;
  }

  async verifyCustomer(phone: string, data: { name?: string; email?: string }): Promise<Customer> {
    let customer = await this.getCustomerByPhone(phone);
    if (!customer) {
      customer = await this.createCustomer({
        phone,
        name: data.name || '',
        email: data.email || null
      });
    } else {
      customer = await this.updateCustomer(customer.id, {
        name: data.name || customer.name,
        email: data.email || customer.email,
        isVerified: true
      });
    }
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const customer = await this.getCustomer(id);
    if (!customer) throw new Error('Customer not found');
    
    const updatedCustomer = { ...customer, ...updates, updatedAt: new Date() };
    await this.db!.collection('customers').doc(id).set(updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.db!.collection('customers').doc(id).delete();
  }

  // Address methods
  async getAddress(id: string): Promise<Address | undefined> {
    const doc = await this.db!.collection('addresses').doc(id).get();
    return doc.exists ? this.convertTimestamps(doc.data() as Address) : undefined;
  }

  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = randomUUID();
    const address: Address = { 
      ...insertAddress, 
      id,
      type: insertAddress.type ?? 'home',
      addressLine2: insertAddress.addressLine2 ?? null,
      country: insertAddress.country ?? 'India',
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db!.collection('addresses').doc(id).set(this.cleanDataForFirestore(address));
    return address;
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<Address> {
    const address = await this.getAddress(id);
    if (!address) throw new Error('Address not found');
    
    const updatedAddress = { ...address, ...updates, updatedAt: new Date() };
    await this.db!.collection('addresses').doc(id).set(updatedAddress);
    return updatedAddress;
  }

  async deleteAddress(id: string): Promise<void> {
    await this.db!.collection('addresses').doc(id).delete();
  }

  async getAddressesByCustomer(customerId: string): Promise<Address[]> {
    const snapshot = await this.db!.collection('addresses').where('customerId', '==', customerId).get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as Address));
  }

  // Order methods
  async getOrderById(id: string): Promise<Order | undefined> {
    const doc = await this.db!.collection('orders').doc(id).get();
    return doc.exists ? this.convertTimestamps(doc.data() as Order) : undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const order: Order = { 
      ...insertOrder, 
      id,
      orderNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: insertOrder.status ?? 'pending',
      paymentStatus: insertOrder.paymentStatus ?? 'pending',
      paymentMethod: insertOrder.paymentMethod ?? 'razorpay',
      razorpayOrderId: insertOrder.razorpayOrderId ?? null,
      razorpayPaymentId: insertOrder.razorpayPaymentId ?? null,
      razorpaySignature: insertOrder.razorpaySignature ?? null,
      shipping: insertOrder.shipping ?? null,
      notes: insertOrder.notes ?? null
    };
    await this.db!.collection('orders').doc(id).set(this.cleanDataForFirestore(order));
    return order;
  }

  async updateOrderPayment(orderId: string, paymentData: { razorpayPaymentId: string; razorpaySignature: string; paymentStatus: string }): Promise<Order> {
    const order = await this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const updatedOrder: Order = {
      ...order,
      razorpayPaymentId: paymentData.razorpayPaymentId,
      razorpaySignature: paymentData.razorpaySignature,
      paymentStatus: paymentData.paymentStatus,
      updatedAt: new Date(),
    };
    await this.db!.collection('orders').doc(orderId).set(updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.db!.collection('orders').doc(id).delete();
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const snapshot = await this.db!.collection('orders').where('customerId', '==', customerId).get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as Order));
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const snapshot = await this.db!.collection('orders').where('orderNumber', '==', orderNumber).get();
    if (snapshot.empty) return undefined;
    return this.convertTimestamps(snapshot.docs[0].data() as Order);
  }

  // Order Item methods
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id,
      createdAt: new Date()
    };
    await this.db!.collection('order_items').doc(id).set(this.cleanDataForFirestore(orderItem));
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const snapshot = await this.db!.collection('order_items').where('orderId', '==', orderId).get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as OrderItem));
  }

  async deleteOrderItem(id: string): Promise<void> {
    await this.db!.collection('order_items').doc(id).delete();
  }

  // Order Tracking methods
  async createOrderTracking(insertOrderTracking: InsertOrderTracking): Promise<OrderTracking> {
    const id = randomUUID();
    const orderTracking: OrderTracking = { 
      ...insertOrderTracking, 
      id,
      location: insertOrderTracking.location ?? null,
      timestamp: new Date()
    };
    await this.db!.collection('order_tracking').doc(id).set(this.cleanDataForFirestore(orderTracking));
    return orderTracking;
  }

  async getOrderTracking(orderId: string): Promise<OrderTracking[]> {
    const snapshot = await this.db!.collection('order_tracking').where('orderId', '==', orderId).get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data() as OrderTracking));
  }

  async updateOrderTracking(id: string, updates: Partial<OrderTracking>): Promise<OrderTracking> {
    const orderTracking = await this.getOrderTrackingById(id);
    if (!orderTracking) throw new Error('Order tracking not found');
    
    const updatedOrderTracking = { ...orderTracking, ...updates, updatedAt: new Date() };
    await this.db!.collection('order_tracking').doc(id).set(updatedOrderTracking);
    return updatedOrderTracking;
  }

  async getOrderTrackingById(id: string): Promise<OrderTracking | undefined> {
    const doc = await this.db!.collection('order_tracking').doc(id).get();
    return doc.exists ? this.convertTimestamps(doc.data() as OrderTracking) : undefined;
  }

  // Payment methods
  async createPayment(paymentData: { orderId: string; amount: string; currency: string; paymentMethod: string; paymentId: string; status: string }): Promise<any> {
    const id = randomUUID();
    const payment = {
      id,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentMethod: paymentData.paymentMethod,
      paymentId: paymentData.paymentId,
      status: paymentData.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await this.db!.collection('payments').doc(id).set(this.cleanDataForFirestore(payment));
    return payment;
  }

  async getPayment(id: string): Promise<any | undefined> {
    const doc = await this.db!.collection('payments').doc(id).get();
    return doc.exists ? this.convertTimestamps(doc.data()) : undefined;
  }

  async getPaymentsByOrder(orderId: string): Promise<any[]> {
    const snapshot = await this.db!.collection('payments').where('orderId', '==', orderId).get();
    return snapshot.docs.map(doc => this.convertTimestamps(doc.data()));
  }

  // Seed data method
  async seedData(): Promise<void> {
    console.log('Seeding data to Firestore...');
    
    // Check if products collection exists and has data
    const productsSnapshot = await this.db!.collection('products').get();
    if (productsSnapshot.empty) {
      console.log('Seeding products...');
      const products = [
        {
          name: "Premium Rose Bush Collection",
          description: "A stunning collection of premium rose bushes perfect for any garden. Includes 3 different varieties with vibrant colors and delightful fragrances.",
          price: 1299,
          image: "/images/rose-collection.jpg",
          category: "plants",
          featured: true,
          stock: 50,
          tags: ["roses", "premium", "collection", "fragrant"]
        },
        {
          name: "Herb Garden Starter Kit",
          description: "Everything you need to start your own herb garden. Includes basil, mint, rosemary, and thyme seeds with growing guide.",
          price: "499",
          image: "/images/herb-kit.jpg",
          category: "seeds",
          featured: true,
          stock: 100,
          tags: ["herbs", "kit", "seeds", "beginner"]
        },
        {
          name: "Luxury Plant Pot Set",
          description: "Beautiful ceramic plant pots in various sizes. Perfect for indoor plants with drainage holes and saucers included.",
          price: "799",
          image: "/images/plant-pots.jpg",
          category: "tools",
          featured: false,
          stock: 75,
          tags: ["pots", "ceramic", "indoor", "drainage"]
        }
      ];

      for (const product of products) {
        await this.createProduct(product);
      }
    }

    // Check if guides collection exists and has data
    const guidesSnapshot = await this.db!.collection('guides').get();
    if (guidesSnapshot.empty) {
      console.log('Seeding guides...');
      const guides = [
        {
          title: "Seed Starting",
          description: "Learn professional techniques for starting seeds indoors to get a head start on the growing season.",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          author: "Mike Chen",
          category: "Seed Starting",
          difficulty: "Intermediate",
          image: "/images/seed.jpg",
          featured: true,
          readTime: "5 min"
        },
        {
          title: "Plant Care Basics",
          description: "Essential tips for keeping your plants healthy and thriving throughout the year.",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          author: "Sarah Johnson",
          category: "Plant Care",
          difficulty: "Beginner",
          image: "/images/care.jpg",
          featured: false,
          readTime: "3 min"
        },
        {
          title: "Seasonal Gardening",
          description: "Plan your garden activities throughout the year with this comprehensive seasonal guide.",
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          author: "David Wilson",
          category: "Planning",
          difficulty: "Advanced",
          image: "/images/seasonal.jpg",
          featured: true,
          readTime: "7 min"
        }
      ];

      for (const guide of guides) {
        await this.createGuide(guide);
      }
    }

    console.log('Data seeding completed successfully!');
  }
}
