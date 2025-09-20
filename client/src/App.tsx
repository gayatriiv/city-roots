import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import GuidesSection from "@/components/GuidesSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import floweringPlantsImage from "@assets/generated_images/Flowering_plants_collection_5d058eb7.png";
import gardeningToolsImage from "@assets/generated_images/Gardening_tools_collection_9c82fa3c.png";
import seedsImage from "@assets/generated_images/Seeds_and_seedlings_9e473d23.png";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([
    //todo: remove mock functionality
    {
      id: "1",
      name: "Premium Rose Bush Collection",
      price: 49.99,
      image: floweringPlantsImage,
      quantity: 2,
      category: "Flowering Plants"
    },
    {
      id: "2",
      name: "Professional Tool Set",
      price: 89.99,
      image: gardeningToolsImage,
      quantity: 1,
      category: "Tools"
    }
  ]);

  const handleAddToCart = (productId: string) => {
    console.log(`Add to cart: ${productId}`); //todo: remove mock functionality
    
    // Mock product data - in real app this would come from product API
    const mockProducts: Record<string, Omit<CartItem, 'quantity'>> = {
      "premium-rose-bush": {
        id: "premium-rose-bush",
        name: "Premium Rose Bush Collection",
        price: 49.99,
        image: floweringPlantsImage,
        category: "Flowering Plants"
      },
      "professional-tool-set": {
        id: "professional-tool-set",
        name: "Professional Tool Set",
        price: 89.99,
        image: gardeningToolsImage,
        category: "Tools"
      },
      "herb-starter-kit": {
        id: "herb-starter-kit",
        name: "Organic Herb Starter Kit",
        price: 24.99,
        image: seedsImage,
        category: "Seeds"
      }
    };

    const product = mockProducts[productId];
    if (!product) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    console.log('Checkout completed'); //todo: remove mock functionality
    setCartItems([]);
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
          onShopNow={() => console.log('Shop now clicked')} //todo: remove mock functionality
          onLearnMore={() => console.log('Learn more clicked')} //todo: remove mock functionality
        />
        
        <CategoriesSection 
          onCategoryClick={(categoryId) => console.log('Category:', categoryId)} //todo: remove mock functionality
        />
        
        <FeaturedProducts
          onProductClick={(productId) => console.log('Product:', productId)} //todo: remove mock functionality
          onAddToCart={handleAddToCart}
          onViewAll={() => console.log('View all products')} //todo: remove mock functionality
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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