import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List, ShoppingCart, Eye, Heart, Star, Sprout, Flower, Apple } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "../contexts/CartContext";
import { getSessionId } from "../lib/session";

interface Plant {
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
}

// Helper function to get plant image URL
const getPlantImageUrl = (filename: string) => {
  return `/images/${filename}`;
};

// Flowering plants data with INR prices
const sampleSeeds: Plant[] = [
  {
    id: "1",
    name: "Hibiscus Plant Seeds",
    price: 1299,
    image: getPlantImageUrl("hibiscus-plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Outdoor Plants",
    description: "Beautiful tropical flowering plant with large, colorful blooms. Perfect for gardens and outdoor spaces.",
    careInstructions: "Plant in well-draining soil. Water regularly during blooming season. Provide full sun for best flowering.",
    lightRequirements: "Full sun (6+ hours)",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining garden soil",
    size: "Medium (40-60cm)",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    tags: ["Flowering", "Tropical", "Colorful Blooms", "Outdoor"]
  },
  {
    id: "2",
    name: "Rose Plant Seeds",
    price: 1599,
    image: getPlantImageUrl("rose plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Outdoor Plants",
    description: "Classic red roses that bloom beautifully in your garden. Perfect for gifting and romantic occasions.",
    careInstructions: "Plant in well-draining soil. Water deeply once a week. Provide 6+ hours of direct sunlight.",
    lightRequirements: "Full sun (6+ hours)",
    wateringSchedule: "Once a week",
    soilType: "Well-draining garden soil",
    size: "Large (40-50cm)",
    rating: 4.8,
    reviews: 127,
    inStock: true,
    tags: ["Flowering", "Garden", "Gift", "Classic"]
  },
  {
    id: "3",
    name: "Marigold Plant Seeds",
    price: 599,
    image: getPlantImageUrl("marigold plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Outdoor Plants",
    description: "Bright orange and yellow marigold flowers. Great for borders, pest control, and adding color to your garden.",
    careInstructions: "Plant in well-draining soil. Water regularly. Deadhead spent flowers to encourage more blooms.",
    lightRequirements: "Full sun to partial shade",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining garden soil",
    size: "Small (20-30cm)",
    rating: 4.6,
    reviews: 95,
    inStock: true,
    tags: ["Flowering", "Pest Control", "Bright Colors", "Easy Care"]
  },
  {
    id: "4",
    name: "Bougainvillea Plant Seeds",
    price: 1899,
    image: getPlantImageUrl("bougainvillea-plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Outdoor Plants",
    description: "Vibrant climbing plant with colorful bracts. Perfect for trellises, walls, and creating stunning garden displays.",
    careInstructions: "Plant in well-draining soil. Water regularly during growing season. Prune after flowering to maintain shape.",
    lightRequirements: "Full sun",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining garden soil",
    size: "Large (60-100cm)",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    tags: ["Climbing", "Colorful", "Vibrant", "Trellis"]
  },
  {
    id: "5",
    name: "Sunflower Plant Seeds",
    price: 799,
    image: getPlantImageUrl("sunflower-plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Outdoor Plants",
    description: "Tall, cheerful sunflowers that follow the sun. Perfect for creating a dramatic garden focal point.",
    careInstructions: "Plant in full sun. Water deeply and regularly. Stake tall varieties to prevent toppling.",
    lightRequirements: "Full sun",
    wateringSchedule: "Daily during hot weather",
    soilType: "Well-draining garden soil",
    size: "Large (100-200cm)",
    rating: 4.5,
    reviews: 78,
    inStock: true,
    tags: ["Tall", "Cheerful", "Sun Following", "Dramatic"]
  },
  {
    id: "6",
    name: "Jasmine Plant Seeds",
    price: 1199,
    image: getPlantImageUrl("jasmine plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Outdoor Plants",
    description: "Fragrant white flowers that bloom at night. Perfect for trellises and garden borders.",
    careInstructions: "Plant in well-draining soil. Water regularly during blooming season. Prune after flowering.",
    lightRequirements: "Full sun to partial shade",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining garden soil",
    size: "Medium (35-45cm)",
    rating: 4.8,
    reviews: 85,
    inStock: true,
    tags: ["Fragrant", "Night Blooming", "Climbing", "White Flowers"]
  },
  {
    id: "7",
    name: "Peace Lily Seeds",
    price: 899,
    image: getPlantImageUrl("Peace Lily.jpeg"),
    category: "Flowering Plants",
    subcategory: "Indoor Plants",
    description: "Elegant white blooms and glossy green leaves. Known for its air-purifying qualities and easy care.",
    careInstructions: "Keep soil moist but not soggy. Place in low to bright indirect light. Blooms year-round.",
    lightRequirements: "Low to bright indirect light",
    wateringSchedule: "Twice a week",
    soilType: "Rich, well-draining soil",
    size: "Small (20-30cm)",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ["Air Purifying", "Indoor", "White Flowers", "Low Light"]
  }
];

const categories = [
  "All Plants",
  "Flowering Plants"
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
  "All Plants": Filter,
  "Flowering Plants": Flower
};

interface SeedsPageProps {
  onAddToCart: (productId: string) => void;
}

export default function SeedsPage({ onAddToCart }: SeedsPageProps) {
  const { addToCart, isInCart } = useCart();
  const sessionId = getSessionId();

  const [selectedCategory, setSelectedCategory] = useState("All Plants");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [, setLocation] = useLocation();

  const handlePlantClick = (plantId: string) => {
    const plant = sampleSeeds.find(p => p.id === plantId);
    setSelectedPlant(plant || null);
  };

  // Filter and sort plants
  const filteredAndSortedPlants = useMemo(() => {
    let filtered = sampleSeeds;

    // Filter by category
    if (selectedCategory !== "All Plants") {
      filtered = filtered.filter(plant => plant.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort plants
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

  // Use this instead:
  const handleAddToCart = (plant: Plant) => {
    addToCart(plant);
    onAddToCart(plant.id); // This line was added
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flowering Plants</h1>
              <p className="text-gray-600 mt-1">
                Beautiful flowering plants for your garden
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
                Search Plants
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
              {filteredAndSortedPlants.map((plant) => (
                <Card key={plant.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {viewMode === "grid" ? (
                      // Grid View
                      <div>
                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                          <img
                            src={plant.image}
                            alt={plant.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {plant.originalPrice && (
                            <Badge className="absolute top-2 left-2 bg-red-500">
                              {Math.round((1 - plant.price / plant.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                          {!plant.inStock && (
                            <Badge variant="secondary" className="absolute top-2 right-2">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                              {plant.name}
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
                            {plant.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {renderStars(plant.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              ({plant.reviews})
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(plant.price)}
                              </span>
                              {plant.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(plant.originalPrice)}
                                </span>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {plant.category}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 text-xs min-w-0"
                              onClick={() => handlePlantClick(plant.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              <span className="truncate">View Details</span>
                            </Button>
                            
                            <Button
                              size="sm"
                              className="flex-1 text-xs min-w-0"
                              onClick={() => handleAddToCart(plant)}
                              disabled={!plant.inStock}
                              variant={isInCart(plant.id) ? "secondary" : "default"}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              <span className="truncate">{isInCart(plant.id) ? 'Added' : 'Add to Cart'}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div className="flex">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <img
                            src={plant.image}
                            alt={plant.name}
                            className="w-full h-full object-cover"
                          />
                          {plant.originalPrice && (
                            <Badge className="absolute top-1 left-1 bg-red-500 text-xs">
                              {Math.round((1 - plant.price / plant.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {plant.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Badge variant="outline" className="text-xs">
                                {plant.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {plant.description}
                          </p>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {renderStars(plant.rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                ({plant.reviews} reviews)
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(plant.price)}
                              </span>
                              {plant.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(plant.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePlantClick(plant.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            
                            <Button
                              size="sm"
                              onClick={() => handleAddToCart(plant)}
                            >
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
            {filteredAndSortedPlants.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No plants found
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
      {selectedPlant && (
        <Dialog open={!!selectedPlant} onOpenChange={() => setSelectedPlant(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedPlant.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={selectedPlant.image}
                  alt={selectedPlant.name}
                  className="w-full h-full object-cover"
                />
                {selectedPlant.originalPrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {Math.round((1 - selectedPlant.price / selectedPlant.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(selectedPlant.price)}
                  </span>
                  {selectedPlant.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(selectedPlant.originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(selectedPlant.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({selectedPlant.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Description</h4>
                <p className="text-gray-600">{selectedPlant.description}</p>
              </div>

              {/* Care Instructions */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Care Instructions</h4>
                <p className="text-gray-600">{selectedPlant.careInstructions}</p>
              </div>

              {/* Plant Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900">Light Requirements</h5>
                  <p className="text-sm text-gray-600">{selectedPlant.lightRequirements}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Watering Schedule</h5>
                  <p className="text-sm text-gray-600">{selectedPlant.wateringSchedule}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Soil Type</h5>
                  <p className="text-sm text-gray-600">{selectedPlant.soilType}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Size</h5>
                  <p className="text-sm text-gray-600">{selectedPlant.size}</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Features</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedPlant.tags.map((tag) => (
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
                    handleAddToCart(selectedPlant);
                    setSelectedPlant(null);
                  }}
                  disabled={!selectedPlant.inStock || isInCart(selectedPlant.id)}
                  variant={isInCart(selectedPlant.id) ? "secondary" : "default"}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInCart(selectedPlant.id) ? "Added" : "Add to Cart"}
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
