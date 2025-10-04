import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, CheckCircle, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/contexts/CartContext";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useScroll } from "@/hooks/useScroll";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  description: string;
  careInstructions: string;
  lightRequirements: string;
  wateringSchedule: string;
  soilType: string;
  size: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
  detailedDescription?: string;
  features?: string[];
  specifications?: { [key: string]: string };
}

interface ProductDetailPageProps {
  productId: string;
  onAddToCart: (productId: string) => void;
}

export default function ProductDetailPage({ productId, onAddToCart }: ProductDetailPageProps) {
  const [, setLocation] = useLocation();
  const { addToCart, isInCart } = useCart();
  const { scrollToTop } = useScroll();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app, this would come from API
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock product data based on ID
      const mockProduct: Product = {
        id: productId,
        name: "Money Plant (Pothos)",
        price: 599,
        originalPrice: 799,
        image: "/images/money plant.jpeg",
        category: "Indoor Plants",
        subcategory: "Indoor",
        description: "Popular trailing plant that's easy to care for and brings good luck. Perfect for beginners and adds a touch of nature to any space.",
        detailedDescription: "The Money Plant, also known as Pothos or Devil's Ivy, is one of the most popular houseplants worldwide. Its heart-shaped leaves and trailing vines make it perfect for hanging baskets, shelves, or as a table centerpiece. This plant is incredibly easy to care for and can thrive in various lighting conditions, making it ideal for beginners.",
        careInstructions: "Water when soil feels dry to touch. Provide bright, indirect light. Fertilize monthly during growing season.",
        lightRequirements: "Bright, indirect light",
        wateringSchedule: "Once a week",
        soilType: "Well-draining potting soil",
        size: "Small to Medium",
        rating: 4.8,
        reviews: 198,
        inStock: true,
        tags: ["Easy Care", "Air Purifying", "Trailing", "Beginner Friendly"],
        features: [
          "Air purifying properties",
          "Easy to propagate",
          "Low maintenance",
          "Trailing growth habit",
          "Pet-friendly (non-toxic)"
        ],
        specifications: {
          "Plant Height": "15-30 cm",
          "Pot Size": "12 cm",
          "Light Requirements": "Bright, indirect light",
          "Watering": "Once a week",
          "Humidity": "40-60%",
          "Temperature": "18-24°C",
          "Growth Rate": "Fast",
          "Lifespan": "Perennial"
        }
      };
      
      return mockProduct;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      onAddToCart(product.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">Product not found</p>
          <Button onClick={() => setLocation('/plants')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const images = [product.image, product.image, product.image]; // In real app, multiple images

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation('/plants')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <Badge variant="destructive">
                  Save {formatPrice(product.originalPrice - product.price)}
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="h-5 w-5 mr-2" />
                  Wishlist
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            {product.features && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Free Delivery</p>
                      <p className="text-sm text-muted-foreground">2-3 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Plant Guarantee</p>
                      <p className="text-sm text-muted-foreground">30 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="care">Care Instructions</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {product.detailedDescription || product.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="care" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Care Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Light Requirements</h4>
                  <p className="text-muted-foreground">{product.lightRequirements}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Watering Schedule</h4>
                  <p className="text-muted-foreground">{product.wateringSchedule}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Soil Type</h4>
                  <p className="text-muted-foreground">{product.soilType}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">General Care</h4>
                  <p className="text-muted-foreground">{product.careInstructions}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                {product.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specifications available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Reviews coming soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <ScrollToTop />
    </div>
  );
}
