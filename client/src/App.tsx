import { Switch, Route, useLocation, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/auth/LoginModal";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import PlantsPage from "@/pages/PlantsPage";
import PlantDetailPage from "@/pages/PlantDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import AuthCallback from "@/pages/AuthCallback";
import ProductDetailPage from "@/pages/ProductDetailPage";
import AboutPage from "@/pages/AboutPage";
import ToolsPage from "@/pages/ToolsPage";
import SeedsPage from "@/pages/SeedsPage";
import GuidesPage from "@/pages/GuidesPage";
import GuideDetailPage from "@/pages/GuideDetailPage";
import GiftingSetsPage from "@/pages/GiftingSetsPage";
import GiftDetailPage from "@/pages/GiftDetailPage";
import SeedDetailPage from "@/pages/SeedDetailPage";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoriesSection from "@/components/CategoriesSection";
import CollectionsSection from "@/components/CollectionsSection";
import GuidesSection from "@/components/GuidesSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ui/ScrollToTop";
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
  const { requireAuth, showLoginModal, setShowLoginModal, handleLoginSuccess } = useAuthGuard();

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
    requireAuth(() => {
      addToCartMutation.mutate({ productId });
    });
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
    requireAuth(() => {
      console.log('Checkout completed');
      clearCartMutation.mutate();
      setIsCartOpen(false);
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background scroll-snap-y">
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
        
        <CollectionsSection
          onCollectionClick={(collectionId) => console.log('Collection:', collectionId)} //todo: remove mock functionality
        />
        
        <GuidesSection
          onGuideClick={(guideId) => console.log('Guide:', guideId)} //todo: remove mock functionality
          onViewAllGuides={() => setLocation('/guides')} // Updated this line
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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => handleLoginSuccess(() => {
          // After successful login, you can perform any additional actions
          console.log('User logged in successfully');
        })}
      />
      
      <ScrollToTop />
    </div>
  );
}

function PlantsPageWrapper() {
  const sessionId = getSessionId();
  const { getTotalItems } = useCart();
  const [, setLocation] = useLocation();
  const { requireAuth, showLoginModal, setShowLoginModal, handleLoginSuccess } = useAuthGuard();
  
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
    requireAuth(() => {
      addToCartMutation.mutate({ productId });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={getTotalItems()}
        onCartClick={() => setLocation('/cart')}
        onSearchChange={(query) => console.log('Search:', query)}
      />
      <PlantsPage onAddToCart={handleAddToCart} />
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => handleLoginSuccess(() => {
          console.log('User logged in successfully');
        })}
      />
      
      <ScrollToTop />
    </div>
  );
}

function ToolsPageWrapper() {
  const { getTotalItems } = useCart();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={getTotalItems()}
        onCartClick={() => setLocation('/cart')}
        onSearchChange={(query) => console.log('Search:', query)}
      />
      <ToolsPage />
      <ScrollToTop />
    </div>
  );
}

function SeedsPageWrapper() {
  return (
    <div className="min-h-screen bg-background">
      <SeedsPage />
      <ScrollToTop />
    </div>
  );
}

function GiftingSetsPageWrapper() {
  return (
    <div className="min-h-screen bg-background">
      <GiftingSetsPage />
      <ScrollToTop />
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
      <ScrollToTop />
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
      <ScrollToTop />
    </div>
  );
}

function PlantDetailPageWrapper() {
  const [, params] = useRoute('/plant/:id');
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

  if (!params?.id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-destructive">Plant ID not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PlantDetailPage plantId={params.id} onAddToCart={handleAddToCart} />
      <ScrollToTop />
    </div>
  );
}

function CartPageWrapper() {
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
      <CartPage onAddToCart={handleAddToCart} />
      <ScrollToTop />
    </div>
  );
}

function CheckoutPageWrapper() {
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
      <CheckoutPage onAddToCart={handleAddToCart} />
      <ScrollToTop />
    </div>
  );
}

function ProductDetailPageWrapper() {
  const [, productParams] = useRoute('/product/:id');
  const [, toolParams] = useRoute('/tool/:id');
  const sessionId = getSessionId();
  const { requireAuth, showLoginModal, setShowLoginModal, handleLoginSuccess } = useAuthGuard();
  
  // Determine which route matched and get the ID
  const params = productParams || toolParams;
  const isTool = !!toolParams;
  
  console.log('ProductDetailPageWrapper - productParams:', productParams);
  console.log('ProductDetailPageWrapper - toolParams:', toolParams);
  console.log('ProductDetailPageWrapper - params:', params);
  console.log('ProductDetailPageWrapper - isTool:', isTool);
  
  const addToCartMutation = useMutation({
    mutationFn: ({ productId }: { productId: string }) => 
      addToCart(sessionId, productId, 1),
    onError: (error) => {
      console.error('Failed to add to cart:', error);
    },
  });

  const handleAddToCart = (productId: string) => {
    requireAuth(() => {
      addToCartMutation.mutate({ productId });
    });
  };

  if (!params?.id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-destructive">Product ID not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProductDetailPage productId={params.id} onAddToCart={handleAddToCart} />
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => handleLoginSuccess(() => {
          console.log('User logged in successfully');
        })}
      />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/plants" component={PlantsPageWrapper} />
      <Route path="/plant/:id" component={PlantDetailPageWrapper} />
      <Route path="/cart" component={CartPageWrapper} />
      <Route path="/checkout" component={CheckoutPageWrapper} />
      <Route path="/track-order" component={OrderTrackingPage} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/tool/:id" component={ProductDetailPageWrapper} />
      <Route path="/product/:id" component={ProductDetailPageWrapper} />
      <Route path="/about" component={AboutPageWrapper} />
      <Route path="/tools" component={ToolsPageWrapper} />
      <Route path="/seeds" component={SeedsPageWrapper} />
      <Route path="/gifting-sets" component={GiftingSetsPageWrapper} />
      <Route path="/guides" component={GuidesPageWrapper} />
      <Route path="/guide/:id" component={GuideDetailPage} />
      <Route path="/gift/:id" component={GiftDetailPage} />
      <Route path="/seed/:id" component={SeedDetailPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
