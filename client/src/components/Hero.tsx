import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import heroImage from "@assets/generated_images/Indoor_living_space_with_plants_70e292ac.png";
import SimpleCounter from "@/components/SimpleCounter";
import { useCart } from "@/contexts/CartContext";

interface HeroProps {
  onShopNow?: () => void;
  onLearnMore?: () => void;
}

export default function Hero({ onShopNow, onLearnMore }: HeroProps) {
  const { getTotalItems } = useCart();
  
  // Calculate dynamic counts
  const totalPlants = 26; // Total plants in our catalog
  const cartItems = getTotalItems();
  const happyCustomers = 150; // Mock data for happy customers
  
  // Debug logging
  console.log('Hero - totalPlants:', totalPlants, 'cartItems:', cartItems, 'happyCustomers:', happyCustomers);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden scroll-snap-start">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful living room with indoor plants and greenery"
          className="w-full h-full object-cover"
        />
        {/* Stronger dark wash gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
          Transform Your Space with
          <span className="block text-green-300">Nature's Beauty</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed font-medium px-4">
          Fresh plants, quality tools, and helpful guides 
          for your urban gardening adventure
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
            onClick={() => {
              console.log('Shop Now clicked'); //todo: remove mock functionality
              onShopNow?.();
            }}
            data-testid="hero-shop-now"
          >
            Shop Now
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
            onClick={() => {
              console.log('Learn More clicked'); //todo: remove mock functionality
              onLearnMore?.();
            }}
            data-testid="hero-learn-more"
          >
            <Leaf className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-white px-4">
          <div className="text-center" data-testid="stat-products">
            <div className="text-3xl font-bold mb-1">
              <SimpleCounter 
                target={totalPlants} 
                duration={2500}
                delay={500}
                suffix="+"
                className="text-green-300"
              />
            </div>
            <div className="text-sm text-gray-300">Plant Varieties</div>
          </div>
          <div className="text-center" data-testid="stat-customers">
            <div className="text-3xl font-bold mb-1">
              <SimpleCounter 
                target={happyCustomers} 
                duration={3000}
                delay={1000}
                suffix="+"
                className="text-blue-300"
              />
            </div>
            <div className="text-sm text-gray-300">Happy Customers</div>
          </div>
          <div className="text-center" data-testid="stat-cart">
            <div className="text-3xl font-bold mb-1">
              <SimpleCounter 
                target={cartItems} 
                duration={2000}
                delay={1500}
                className="text-yellow-300"
              />
            </div>
            <div className="text-sm text-gray-300">Items in Cart</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}