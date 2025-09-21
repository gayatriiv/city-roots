import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List, ShoppingCart, Eye, Heart, Star, Sprout, Flower, Apple } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Seed {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  growingSeason: string;
  germinationTime: string;
  plantHeight: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

// Sample seeds data with INR prices
const sampleSeeds: Seed[] = [
  {
    id: "1",
    name: "Tomato Seeds - Cherry",
    price: 299,
    originalPrice: 399,
    image: "/images/seeds.jpg",
    category: "Vegetable Seeds",
    description: "High-yielding cherry tomato seeds perfect for home gardens. Produces sweet, bite-sized tomatoes.",
    growingSeason: "Year Round",
    germinationTime: "7-14 days",
    plantHeight: "1.5-2m",
    rating: 4.8,
    reviews: 127,
    inStock: true,
    tags: ["High Yield", "Sweet", "Easy to Grow"]
  },
  {
    id: "2",
    name: "Sunflower Seeds - Giant",
    price: 199,
    image: "/images/seeds.jpg",
    category: "Flower Seeds",
    description: "Giant sunflower seeds that grow up to 3 meters tall with beautiful yellow flowers.",
    growingSeason: "Spring to Summer",
    germinationTime: "10-21 days",
    plantHeight: "2-3m",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ["Giant", "Yellow", "Tall"]
  },
  {
    id: "3",
    name: "Basil Seeds - Sweet",
    price: 149,
    originalPrice: 199,
    image: "/images/seeds.jpg",
    category: "Herb Seeds",
    description: "Aromatic sweet basil seeds perfect for cooking and pesto making. Easy to grow indoors or outdoors.",
    growingSeason: "Year Round",
    germinationTime: "7-14 days",
    plantHeight: "30-60cm",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    tags: ["Aromatic", "Culinary", "Indoor Friendly"]
  },
  {
    id: "4",
    name: "Carrot Seeds - Rainbow",
    price: 249,
    image: "/images/seeds.jpg",
    category: "Vegetable Seeds",
    description: "Colorful rainbow carrot seeds that produce carrots in purple, yellow, and orange colors.",
    growingSeason: "Cool Season",
    germinationTime: "14-21 days",
    plantHeight: "15-30cm",
    rating: 4.5,
    reviews: 74,
    inStock: true,
    tags: ["Colorful", "Nutritious", "Unique"]
  },
  {
    id: "5",
    name: "Marigold Seeds - French",
    price: 179,
    image: "/images/seeds.jpg",
    category: "Flower Seeds",
    description: "Bright orange and yellow French marigold seeds. Great for borders and pest control.",
    growingSeason: "Spring to Fall",
    germinationTime: "7-14 days",
    plantHeight: "20-30cm",
    rating: 4.9,
    reviews: 93,
    inStock: true,
    tags: ["Pest Control", "Bright Colors", "Easy Care"]
  },
  {
    id: "6",
    name: "Strawberry Seeds - Alpine",
    price: 399,
    image: "/images/seeds.jpg",
    category: "Fruit Seeds",
    description: "Alpine strawberry seeds that produce small, sweet strawberries perfect for containers.",
    growingSeason: "Spring to Fall",
    germinationTime: "21-30 days",
    plantHeight: "15-20cm",
    rating: 4.4,
    reviews: 67,
    inStock: true,
    tags: ["Sweet", "Container Friendly", "Perennial"]
  }
];

const categories = [
  "All Seeds",
  "Vegetable Seeds",
  "Flower Seeds",
  "Herb Seeds",
  "Fruit Seeds",
  "Starter Kits"
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" }
];

const categoryIcons = {
  "Vegetable Seeds": Apple,
  "Flower Seeds": Flower,
  "Herb Seeds": Sprout,
  "Fruit Seeds": Apple,
  "Starter Kits": Sprout,
  "All Seeds": Filter
};

interface SeedsPageProps {
  onAddToCart: (productId: string) => void;
}

export default function SeedsPage({ onAddToCart }: SeedsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Seeds");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSeed, setSelectedSeed] = useState<Seed | null>(null);

  // Filter and sort seeds
  const filteredAndSortedSeeds = useMemo(() => {
    let filtered = sampleSeeds;

    // Filter by category
    if (selectedCategory !== "All Seeds") {
      filtered = filtered.filter(seed => seed.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(seed =>
        seed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seed.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seed.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort seeds
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.reverse();
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, searchQuery]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seeds & Seedlings</h1>
              <p className="text-gray-600 mt-1">
                Grow your own garden from seed
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Seeds
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            <div className={`${
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }`}>
              {filteredAndSortedSeeds.map((seed) => (
                <Card key={seed.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {viewMode === "grid" ? (
                      // Grid View
                      <div>
                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                          <img
                            src={seed.image}
                            alt={seed.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {seed.originalPrice && (
                            <Badge className="absolute top-2 left-2 bg-red-500">
                              {Math.round((1 - seed.price / seed.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                          {!seed.inStock && (
                            <Badge variant="secondary" className="absolute top-2 right-2">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                              {seed.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {seed.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {renderStars(seed.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              ({seed.reviews})
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(seed.price)}
                              </span>
                              {seed.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(seed.originalPrice)}
                                </span>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {seed.category}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => setSelectedSeed(seed)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                            
                            <Button 
                              className="flex-1"
                              onClick={() => onAddToCart(seed.id)}
                              disabled={!seed.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div className="flex">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <img
                            src={seed.image}
                            alt={seed.name}
                            className="w-full h-full object-cover"
                          />
                          {seed.originalPrice && (
                            <Badge className="absolute top-1 left-1 bg-red-500 text-xs">
                              {Math.round((1 - seed.price / seed.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {seed.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Badge variant="outline" className="text-xs">
                                {seed.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {seed.description}
                          </p>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {renderStars(seed.rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                ({seed.reviews} reviews)
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(seed.price)}
                              </span>
                              {seed.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(seed.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedSeed(seed)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                            
                            <Button 
                              size="sm"
                              onClick={() => onAddToCart(seed.id)}
                              disabled={!seed.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredAndSortedSeeds.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No seeds found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedSeed && (
        <Dialog open={!!selectedSeed} onOpenChange={() => setSelectedSeed(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedSeed.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={selectedSeed.image}
                  alt={selectedSeed.name}
                  className="w-full h-full object-cover"
                />
                {selectedSeed.originalPrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {Math.round((1 - selectedSeed.price / selectedSeed.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(selectedSeed.price)}
                  </span>
                  {selectedSeed.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(selectedSeed.originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(selectedSeed.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({selectedSeed.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Description</h4>
                <p className="text-gray-600">{selectedSeed.description}</p>
              </div>

              {/* Growing Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900">Growing Season</h5>
                  <p className="text-sm text-gray-600">{selectedSeed.growingSeason}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Germination Time</h5>
                  <p className="text-sm text-gray-600">{selectedSeed.germinationTime}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Plant Height</h5>
                  <p className="text-sm text-gray-600">{selectedSeed.plantHeight}</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Features</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedSeed.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    onAddToCart(selectedSeed.id);
                    setSelectedSeed(null);
                  }}
                  disabled={!selectedSeed.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
