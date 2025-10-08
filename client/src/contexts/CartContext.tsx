import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

export interface Plant extends Product {
  subcategory: string;
  careInstructions: string;
  lightRequirements: string;
  wateringSchedule: string;
  soilType: string;
  size: string;
}

export interface Tool extends Product {
  // Tools don't have plant-specific properties
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
  clearCart: () => void;
  requireAuth: () => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('CartContext: Loading cart from localStorage');
    const savedCart = localStorage.getItem('verdantCart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        console.log('CartContext: Loaded cart data:', cartData);
        
        // Migrate old cart items to new format
        const migratedCart = cartData.map((item: any) => {
          if (item.plant && !item.product) {
            // Convert old format to new format
            return {
              product: item.plant,
              quantity: item.quantity
            };
          }
          return item;
        });
        
        setCartItems(migratedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    } else {
      console.log('CartContext: No saved cart found');
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    console.log('CartContext: Cart items changed:', cartItems);
    localStorage.setItem('verdantCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    console.log('CartContext: Adding product to cart:', product.name, product.id);
    setCartItems(prev => {
      const existingItem = prev.find(item => {
        const itemProduct = item.product || (item as any).plant;
        return itemProduct && itemProduct.id === product.id;
      });
      if (existingItem) {
        console.log('CartContext: Updating existing item quantity');
        return prev.map(item => {
          const itemProduct = item.product || (item as any).plant;
          return itemProduct && itemProduct.id === product.id
            ? { product, quantity: item.quantity + 1 }
            : item;
        });
      } else {
        console.log('CartContext: Adding new item to cart');
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const requireAuth = (): boolean => {
    return !!user;
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => {
      const product = item.product || (item as any).plant;
      return product && product.id !== productId;
    }));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => {
        const product = item.product || (item as any).plant;
        return product && product.id === productId 
          ? { product, quantity }
          : item;
      })
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = item.product || (item as any).plant;
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const isInCart = (productId: string) => {
    return cartItems.some(item => {
      // Handle both old and new cart item structures
      const product = item.product || (item as any).plant;
      return product && product.id === productId;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('verdantCart');
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    isInCart,
    clearCart,
    requireAuth
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
