import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { getImageUrl } from "@/lib/api";

interface FeaturedProductsProps {
  onProductClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onViewAll?: () => void;
}

export default function FeaturedProducts({ onProductClick, onAddToCart, onViewAll }: FeaturedProductsProps) {
  const { data: featuredProducts = [], isLoading } = useQuery({
    queryKey: ['products', { featured: true }],
    queryFn: () => fetchProducts({ featured: true }),
  });

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
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="bg-muted h-48 rounded-md mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                  <div className="bg-muted h-4 rounded w-1/2"></div>
                  <div className="bg-muted h-6 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : (
            featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={parseFloat(product.price)}
                originalPrice={product.originalPrice ? parseFloat(product.originalPrice) : undefined}
                image={getImageUrl(product.image)}
                category={product.category}
                difficulty={product.difficulty as any}
                rating={parseFloat(product.rating || '0')}
                reviewCount={product.reviewCount || 0}
                inStock={product.inStock || false}
                isOnSale={product.isOnSale || false}
                description={product.description}
                onAddToCart={onAddToCart}
                onViewDetails={onProductClick}
                onToggleWishlist={(id, isWishlisted) => {
                  console.log(`Product ${id} wishlist toggled: ${isWishlisted}`);
                }}
              />
            ))
          )}
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