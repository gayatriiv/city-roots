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
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Cart methods
  getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(sessionId: string, productId: string, quantity?: number): Promise<CartItem>;
  updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(sessionId: string, productId: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;

  // Guide methods
  getAllGuides(): Promise<Guide[]>;
  getGuide(id: string): Promise<Guide | undefined>;
  getFeaturedGuides(): Promise<Guide[]>;
  getGuidesByCategory(category: string): Promise<Guide[]>;
  createGuide(guide: InsertGuide): Promise<Guide>;

  // Customer methods
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByPhone(phone: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  verifyCustomer(phone: string, data: { name?: string; email?: string }): Promise<Customer>;

  // Address methods
  createAddress(address: InsertAddress): Promise<Address>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  updateOrderPayment(orderId: string, paymentData: { razorpayPaymentId: string; razorpaySignature: string; paymentStatus: string }): Promise<Order>;

  // Order Item methods
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;

  // Order Tracking methods
  createOrderTracking(tracking: InsertOrderTracking): Promise<OrderTracking>;
  getOrderTracking(orderId: string): Promise<OrderTracking[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private guides: Map<string, Guide>;
  private customers: Map<string, Customer>;
  private addresses: Map<string, Address>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private orderTracking: Map<string, OrderTracking>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.guides = new Map();
    this.customers = new Map();
    this.addresses = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.orderTracking = new Map();
    this.seedData();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      originalPrice: insertProduct.originalPrice ?? null,
      difficulty: insertProduct.difficulty ?? null,
      rating: insertProduct.rating ?? null,
      reviewCount: insertProduct.reviewCount ?? null,
      inStock: insertProduct.inStock ?? true,
      isOnSale: insertProduct.isOnSale ?? false,
      featured: insertProduct.featured ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = {
      ...product,
      ...updateData,
      updatedAt: new Date(),
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(
      item => item.sessionId === sessionId
    );
    
    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      return { ...item, product };
    });
  }

  async addToCart(sessionId: string, productId: string, quantity: number = 1): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.productId === productId
    );

    if (existingItem) {
      // Update quantity
      const updatedItem: CartItem = {
        ...existingItem,
        quantity: existingItem.quantity + quantity,
        updatedAt: new Date(),
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    } else {
      // Create new cart item
      const id = randomUUID();
      const cartItem: CartItem = {
        id,
        sessionId,
        productId,
        quantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<CartItem | undefined> {
    const item = Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.productId === productId
    );
    
    if (!item) return undefined;
    
    const updatedItem: CartItem = {
      ...item,
      quantity,
      updatedAt: new Date(),
    };
    this.cartItems.set(item.id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(sessionId: string, productId: string): Promise<boolean> {
    const item = Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.productId === productId
    );
    
    if (!item) return false;
    return this.cartItems.delete(item.id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToDelete = Array.from(this.cartItems.values()).filter(
      item => item.sessionId === sessionId
    );
    
    itemsToDelete.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  // Guide methods
  async getAllGuides(): Promise<Guide[]> {
    return Array.from(this.guides.values());
  }

  async getGuide(id: string): Promise<Guide | undefined> {
    return this.guides.get(id);
  }

  async getFeaturedGuides(): Promise<Guide[]> {
    return Array.from(this.guides.values()).filter(guide => guide.featured);
  }

  async getGuidesByCategory(category: string): Promise<Guide[]> {
    return Array.from(this.guides.values()).filter(
      guide => guide.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const id = randomUUID();
    const guide: Guide = {
      ...insertGuide,
      id,
      featured: insertGuide.featured ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.guides.set(id, guide);
    return guide;
  }

  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(customer => customer.phone === phone);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = {
      ...insertCustomer,
      id,
      isVerified: insertCustomer.isVerified ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  async verifyCustomer(phone: string, data: { name?: string; email?: string }): Promise<Customer> {
    const customer = await this.getCustomerByPhone(phone);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const updatedCustomer: Customer = {
      ...customer,
      name: data.name || customer.name,
      email: data.email || customer.email,
      isVerified: true,
      updatedAt: new Date(),
    };
    this.customers.set(customer.id, updatedCustomer);
    return updatedCustomer;
  }

  // Address methods
  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = randomUUID();
    const address: Address = {
      ...insertAddress,
      id,
      isDefault: insertAddress.isDefault ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.addresses.set(id, address);
    return address;
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status ?? 'pending',
      paymentStatus: insertOrder.paymentStatus ?? 'pending',
      paymentMethod: insertOrder.paymentMethod ?? 'razorpay',
      razorpayOrderId: insertOrder.razorpayOrderId ?? null,
      razorpayPaymentId: insertOrder.razorpayPaymentId ?? null,
      razorpaySignature: insertOrder.razorpaySignature ?? null,
      shipping: insertOrder.shipping ?? null,
      notes: insertOrder.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(order => order.orderNumber === orderNumber);
  }

  async updateOrderPayment(orderId: string, paymentData: { razorpayPaymentId: string; razorpaySignature: string; paymentStatus: string }): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const updatedOrder: Order = {
      ...order,
      razorpayPaymentId: paymentData.razorpayPaymentId,
      razorpaySignature: paymentData.razorpaySignature,
      paymentStatus: paymentData.paymentStatus,
      updatedAt: new Date(),
    };
    this.orders.set(orderId, updatedOrder);
    return updatedOrder;
  }

  // Order Item methods
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = {
      ...insertOrderItem,
      id,
      createdAt: new Date(),
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  // Order Tracking methods
  async createOrderTracking(insertOrderTracking: InsertOrderTracking): Promise<OrderTracking> {
    const id = randomUUID();
    const tracking: OrderTracking = {
      ...insertOrderTracking,
      id,
      timestamp: insertOrderTracking.timestamp ?? new Date(),
    };
    this.orderTracking.set(id, tracking);
    return tracking;
  }

  async getOrderTracking(orderId: string): Promise<OrderTracking[]> {
    return Array.from(this.orderTracking.values())
      .filter(tracking => tracking.orderId === orderId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  // Seed data for development
  private seedData() {
    // Sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Rose Bush Collection",
        description: "Beautiful collection of hybrid roses perfect for beginners. Includes red, pink, and white varieties with full care instructions.",
        price: "49.99",
        originalPrice: "69.99",
        image: "/images/rose bush.jpg",
        category: "Flowering Plants",
        difficulty: "Beginner",
        rating: "4.8",
        reviewCount: 156,
        inStock: true,
        isOnSale: true,
        featured: true,
      },
      {
        name: "Professional Gardening Tool Set",
        description: "Complete set of professional-grade tools including pruners, trowel, watering can, and more.",
        price: "89.99",
        image: "/images/gardening toolkit.jpg",
        category: "Gardening Tools",
        rating: "4.9",
        reviewCount: 243,
        inStock: true,
        isOnSale: false,
        featured: true,
      },
      {
        name: "Organic Herb Starter Kit",
        description: "Everything you need to start your herb garden with basil, parsley, cilantro, and rosemary seeds.",
        price: "24.99",
        originalPrice: "34.99",
        image: "/images/herbal toolkit.jpg",
        category: "Seeds",
        difficulty: "Beginner",
        rating: "4.6",
        reviewCount: 89,
        inStock: true,
        isOnSale: true,
        featured: true,
      },
      {
        name: "Mini Succulent Collection",
        description: "Adorable collection of 6 mini succulents perfect for indoor decoration and gifts.",
        price: "34.99",
        image: "/images/mini plants.jpg",
        category: "Decorative Plants",
        difficulty: "Beginner",
        rating: "4.7",
        reviewCount: 124,
        inStock: true,
        isOnSale: false,
        featured: true,
      },
      {
        name: "Heirloom Tomato Plant Set",
        description: "Heritage variety tomato plants that produce delicious, flavorful tomatoes all season long.",
        price: "19.99",
        image: "/images/tomato.jpg",
        category: "Fruit Plants",
        difficulty: "Intermediate",
        rating: "4.5",
        reviewCount: 78,
        inStock: true,
        isOnSale: false,
        featured: true,
      },
      {
        name: "New Gardener's Gift Kit",
        description: "Complete starter kit with tools, seeds, pots, and comprehensive beginner's guide.",
        price: "79.99",
        originalPrice: "99.99",
        image: "/images/beginner.jpg",
        category: "Gift Kits",
        difficulty: "Beginner",
        rating: "4.9",
        reviewCount: 156,
        inStock: true,
        isOnSale: true,
        featured: true,
      },
    ];

    // Create sample products
    sampleProducts.forEach(product => {
      this.createProduct(product);
    });

    // Sample guides
    const sampleGuides: InsertGuide[] = [
      {
        title: "Starting Your First Garden: A Complete Beginner's Guide",
        description: "Everything you need to know to start your gardening journey, from choosing the right location to planting your first seeds.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        image: "/images/beginner guide.jpg",
        difficulty: "Beginner",
        readTime: "8 min read",
        author: "Sarah Johnson",
        category: "Getting Started",
        featured: true,
      },
      {
        title: "Master the Art of Starting Seeds Indoors",
        description: "Learn professional techniques for starting seeds indoors to get a head start on the growing season.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        image: "/images/seed.jpg",
        difficulty: "Intermediate",
        readTime: "12 min read",
        author: "Mike Chen",
        category: "Seed Starting",
        featured: true,
      },
      {
        title: "Essential Tools Every Gardener Should Own",
        description: "Discover the must-have tools that will make your gardening tasks easier and more efficient.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
        image: "/images/essentials.jpg",
        difficulty: "Beginner",
        readTime: "6 min read",
        author: "Emma Davis",
        category: "Tools & Equipment",
        featured: true,
      },
    ];

    // Create sample guides
    sampleGuides.forEach(guide => {
      this.createGuide(guide);
    });
  }
}

export const storage = new MemStorage();
