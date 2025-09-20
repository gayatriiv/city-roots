import type { Product, Guide } from "@shared/schema";

const API_BASE = "/api";

// Product API
export async function fetchProducts(options: {
  featured?: boolean;
  category?: string;
  search?: string;
} = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  
  if (options.featured) params.set('featured', 'true');
  if (options.category) params.set('category', options.category);
  if (options.search) params.set('search', options.search);
  
  const queryString = params.toString();
  const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }
  
  return response.json();
}

// Cart API
export async function fetchCartItems(sessionId: string): Promise<Array<{
  id: string;
  sessionId: string;
  productId: string;
  quantity: number;
  product: Product;
}>> {
  const response = await fetch(`${API_BASE}/cart/${sessionId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cart: ${response.statusText}`);
  }
  
  return response.json();
}

export async function addToCart(sessionId: string, productId: string, quantity: number = 1): Promise<any> {
  const response = await fetch(`${API_BASE}/cart/${sessionId}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add to cart: ${response.statusText}`);
  }
  
  return response.json();
}

export async function updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<any> {
  const response = await fetch(`${API_BASE}/cart/${sessionId}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update cart: ${response.statusText}`);
  }
  
  return response.json();
}

export async function removeFromCart(sessionId: string, productId: string): Promise<any> {
  const response = await fetch(`${API_BASE}/cart/${sessionId}/remove/${productId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to remove from cart: ${response.statusText}`);
  }
  
  return response.json();
}

export async function clearCart(sessionId: string): Promise<any> {
  const response = await fetch(`${API_BASE}/cart/${sessionId}/clear`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to clear cart: ${response.statusText}`);
  }
  
  return response.json();
}

// Guide API
export async function fetchGuides(options: {
  featured?: boolean;
  category?: string;
} = {}): Promise<Guide[]> {
  const params = new URLSearchParams();
  
  if (options.featured) params.set('featured', 'true');
  if (options.category) params.set('category', options.category);
  
  const queryString = params.toString();
  const url = `${API_BASE}/guides${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch guides: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchGuide(id: string): Promise<Guide> {
  const response = await fetch(`${API_BASE}/guides/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch guide: ${response.statusText}`);
  }
  
  return response.json();
}

// Utility function to get/create session ID
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('cart-session-id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('cart-session-id', sessionId);
  }
  return sessionId;
}

// Image helper function
export function getImageUrl(imagePath: string): string {
  // For our generated images, we need to convert the API path to the actual import path
  const imageMap: { [key: string]: string } = {
    '/api/images/flowering-plants.jpg': '/src/assets/generated_images/Flowering_plants_collection_5d058eb7.png',
    '/api/images/gardening-tools.jpg': '/src/assets/generated_images/Gardening_tools_collection_9c82fa3c.png',
    '/api/images/seeds.jpg': '/src/assets/generated_images/Seeds_and_seedlings_9e473d23.png',
    '/api/images/hero.jpg': '/src/assets/generated_images/Indoor_living_space_with_plants_70e292ac.png'
  };
  
  return imageMap[imagePath] || imagePath;
}