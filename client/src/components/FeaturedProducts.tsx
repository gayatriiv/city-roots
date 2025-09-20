import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import floweringPlantsImage from "@assets/generated_images/Flowering_plants_collection_5d058eb7.png";
import gardeningToolsImage from "@assets/generated_images/Gardening_tools_collection_9c82fa3c.png";
import seedsImage from "@assets/generated_images/Seeds_and_seedlings_9e473d23.png";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isOnSale?: boolean;
  description: string;
}

interface FeaturedProductsProps {
  onProductClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onViewAll?: () => void;
}

export default function FeaturedProducts({ onProductClick, onAddToCart, onViewAll }: FeaturedProductsProps) {
  //todo: remove mock functionality
  const featuredProducts: Product[] = [
    {
      id: "premium-rose-bush",
      name: "Premium Rose Bush Collection",
      price: 49.99,
      originalPrice: 69.99,
      image: floweringPlantsImage,
      category: "Flowering Plants",
      difficulty: "Beginner",
      rating: 4.8,
      reviewCount: 156,
      inStock: true,
      isOnSale: true,
      description: "Beautiful collection of hybrid roses perfect for beginners. Includes red, pink, and white varieties."
    },
    {
      id: "professional-tool-set",
      name: "Professional Gardening Tool Set",
      price: 89.99,
      image: gardeningToolsImage,
      category: "Gardening Tools",
      rating: 4.9,
      reviewCount: 243,
      inStock: true,
      description: "Complete set of professional-grade tools including pruners, trowel, watering can, and more."
    },
    {
      id: "herb-starter-kit",
      name: "Organic Herb Starter Kit",
      price: 24.99,
      originalPrice: 34.99,
      image: seedsImage,
      category: "Seeds",
      difficulty: "Beginner",
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
      isOnSale: true,
      description: "Everything you need to start your herb garden with basil, parsley, cilantro, and rosemary seeds."
    },
    {
      id: "succulent-collection",
      name: "Mini Succulent Collection",
      price: 34.99,
      image: floweringPlantsImage, // Reusing for demo
      category: "Decorative Plants",
      difficulty: "Beginner",
      rating: 4.7,
      reviewCount: 124,
      inStock: true,
      description: "Adorable collection of 6 mini succulents perfect for indoor decoration and gifts."
    },
    {
      id: "tomato-plant-set",
      name: "Heirloom Tomato Plant Set",
      price: 19.99,
      image: seedsImage, // Reusing for demo
      category: "Fruit Plants",
      difficulty: "Intermediate",
      rating: 4.5,
      reviewCount: 78,
      inStock: false,
      description: "Heritage variety tomato plants that produce delicious, flavorful tomatoes all season long."
    },
    {
      id: "gardener-gift-kit",
      name: "New Gardener's Gift Kit",
      price: 79.99,
      originalPrice: 99.99,
      image: gardeningToolsImage, // Reusing for demo
      category: "Gift Kits",
      difficulty: "Beginner",
      rating: 4.9,
      reviewCount: 156,
      inStock: true,
      isOnSale: true,
      description: "Complete starter kit with tools, seeds, pots, and comprehensive beginner's guide."
    }
  ];

  return (
    <section className="py-16 bg-accent/30" data-testid="featured-products-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground">
              Handpicked selections from our gardening experts
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              console.log('View all products clicked'); //todo: remove mock functionality
              onViewAll?.();
            }}
            className="hidden sm:flex"
            data-testid="view-all-products"
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={onAddToCart}
              onViewDetails={onProductClick}
              onToggleWishlist={(id, isWishlisted) => {
                console.log(`Product ${id} wishlist toggled: ${isWishlisted}`); //todo: remove mock functionality
              }}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center sm:hidden">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              console.log('View all products clicked (mobile)'); //todo: remove mock functionality
              onViewAll?.();
            }}
            data-testid="view-all-products-mobile"
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}