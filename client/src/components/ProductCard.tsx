import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star, Info } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
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
  onAddToCart?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onToggleWishlist?: (id: string, isWishlisted: boolean) => void;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  difficulty,
  rating,
  reviewCount,
  inStock,
  isOnSale,
  description,
  onAddToCart,
  onViewDetails,
  onToggleWishlist
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    console.log(`Added ${name} to cart`); //todo: remove mock functionality
    onAddToCart?.(id);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleToggleWishlist = () => {
    const newWishlistState = !isWishlisted;
    setIsWishlisted(newWishlistState);
    console.log(`${newWishlistState ? 'Added to' : 'Removed from'} wishlist: ${name}`); //todo: remove mock functionality
    onToggleWishlist?.(id, newWishlistState);
  };

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="group hover-elevate transition-all duration-300 overflow-hidden" data-testid={`product-card-${id}`}>
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOnSale && (
            <Badge className="bg-destructive text-destructive-foreground" data-testid="sale-badge">
              -{discount}% OFF
            </Badge>
          )}
          {difficulty && (
            <Badge variant="secondary" data-testid="difficulty-badge">
              {difficulty}
            </Badge>
          )}
          {!inStock && (
            <Badge variant="destructive" data-testid="stock-badge">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 ${
            isWishlisted ? 'text-red-500' : 'text-gray-600'
          }`}
          onClick={handleToggleWishlist}
          data-testid="wishlist-button"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs" data-testid="category-badge">
            {category}
          </Badge>
          
          <h3 className="font-semibold text-lg leading-tight text-card-foreground" data-testid="product-name">
            {name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid="product-description">
            {description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1" data-testid="rating">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2" data-testid="price">
            <span className="text-xl font-bold text-primary">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            console.log(`View details for ${name}`); //todo: remove mock functionality
            onViewDetails?.(id);
          }}
          data-testid="view-details-button"
        >
          <Info className="h-4 w-4 mr-1" />
          Details
        </Button>
        
        <Button
          size="sm"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!inStock || isLoading}
          data-testid="add-to-cart-button"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          {isLoading ? 'Adding...' : inStock ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </CardFooter>
    </Card>
  );
}