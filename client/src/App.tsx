import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import PlantsPage from "@/pages/PlantsPage";
import AboutPage from "@/pages/AboutPage";
import ToolsPage from "@/pages/ToolsPage";
import SeedsPage from "@/pages/SeedsPage";
import GuidesPage from "@/pages/GuidesPage";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import GuidesSection from "@/components/GuidesSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { fetchCartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart, getSessionId, getImageUrl } from "@/lib/api";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [, setLocation] = useLocation();
  const sessionId = getSessionId();

  // Fetch cart items
  const { data: cartData = [], refetch: refetchCart } = useQuery({
    queryKey: ['cart', sessionId],
    queryFn: () => fetchCartItems(sessionId),
  });

  // Transform cart data for UI
  const cartItems: CartItem[] = cartData.map(item => ({
    id: item.productId,
    name: item.product.name,
    price: parseFloat(item.product.price),
    image: getImageUrl(item.product.image),
    quantity: item.quantity,
    category: item.product.category,
  }));

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: ({ productId }: { productId: string }) => 
      addToCart(sessionId, productId, 1),
    onSuccess: () => {
      refetchCart();
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItemQuantity(sessionId, productId, quantity),
    onSuccess: () => {
      refetchCart();
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      removeFromCart(sessionId, productId),
    onSuccess: () => {
      refetchCart();
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => clearCart(sessionId),
    onSuccess: () => {
      refetchCart();
    },
  });

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate({ productId });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemMutation.mutate({ productId });
    } else {
      updateQuantityMutation.mutate({ productId, quantity });
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItemMutation.mutate({ productId });
  };

  const handleCheckout = () => {
    console.log('Checkout completed');
    clearCartMutation.mutate();
    setIsCartOpen(false);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={totalItems}
        onCartClick={() => setIsCartOpen(true)}
        onSearchChange={(query) => console.log('Search:', query)} //todo: remove mock functionality
      />
      
      <main>
        <Hero 
          onShopNow={() => setLocation('/plants')}
          onLearnMore={() => setLocation('/about')}
        />
        
        <CategoriesSection 
          onCategoryClick={(categoryId) => console.log('Category:', categoryId)} //todo: remove mock functionality
        />
        
        <FeaturedProducts
          onProductClick={(productId) => console.log('Product:', productId)} //todo: remove mock functionality
          onAddToCart={handleAddToCart}
          onViewAll={() => setLocation('/plants')}
        />
        
        <GuidesSection
          onGuideClick={(guideId) => console.log('Guide:', guideId)} //todo: remove mock functionality
          onViewAllGuides={() => console.log('View all guides')} //todo: remove mock functionality
        />
      </main>
      
      <Footer
        onNewsletterSignup={(email) => console.log('Newsletter:', email)} //todo: remove mock functionality
        onNavigate={(section) => console.log('Navigate:', section)} //todo: remove mock functionality
      />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

function PlantsPageWrapper() {
  const sessionId = getSessionId();
  
  const addToCartMutation = useMutation({
    mutationFn: ({ productId }: { productId: string }) => 
      addToCart(sessionId, productId, 1),
    onSuccess: () => {
      console.log('Added to cart successfully');
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
    },
  });

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate({ productId });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={0}
        onCartClick={() => console.log('Cart clicked')}
        onSearchChange={(query) => console.log('Search:', query)}
      />
      <PlantsPage onAddToCart={handleAddToCart} />
    </div>
  );
}

function ToolsPageWrapper() {
  const sessionId = getSessionId();
  
  const addToCartMutation = useMutation({
    mutationFn: ({ productId }: { productId: string }) => 
      addToCart(sessionId, productId, 1),
    onSuccess: () => {
      console.log('Added to cart successfully');
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
    },
  });

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate({ productId });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={0}
        onCartClick={() => console.log('Cart clicked')}
        onSearchChange={(query) => console.log('Search:', query)}
      />
      <ToolsPage onAddToCart={handleAddToCart} />
    </div>
  );
}

function SeedsPageWrapper() {
  const sessionId = getSessionId();
  
  const addToCartMutation = useMutation({
    mutationFn: ({ productId }: { productId: string }) => 
      addToCart(sessionId, productId, 1),
    onSuccess: () => {
      console.log('Added to cart successfully');
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
    },
  });

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate({ productId });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={0}
        onCartClick={() => console.log('Cart clicked')}
        onSearchChange={(query) => console.log('Search:', query)}
      />
      <SeedsPage onAddToCart={handleAddToCart} />
    </div>
  );
}

function AboutPageWrapper() {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={0}
        onCartClick={() => console.log('Cart clicked')}
        onSearchChange={(query) => console.log('Search:', query)}
      />
      <AboutPage />
    </div>
  );
}

function GuidesPageWrapper() {
  const handleGuideClick = (guideId: string) => {
    console.log('Guide clicked:', guideId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={0}
        onCartClick={() => console.log('Cart clicked')}
        onSearchChange={(query) => console.log('Search:', query)}
      />
      <GuidesPage onGuideClick={handleGuideClick} />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/plants" component={PlantsPageWrapper} />
      <Route path="/about" component={AboutPageWrapper} />
      <Route path="/tools" component={ToolsPageWrapper} />
      <Route path="/seeds" component={SeedsPageWrapper} />
      <Route path="/guides" component={GuidesPageWrapper} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;