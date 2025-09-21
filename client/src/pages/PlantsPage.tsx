import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List, ShoppingCart, Eye, Heart, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/api";

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
  // Use images from public directory
  return `/images/${filename}`;
};

// Sample plant data with INR prices
const samplePlants: Plant[] = [
  {
    id: "1",
    name: "Monstera Deliciosa",
    price: 1299,
    originalPrice: 1599,
    image: getPlantImageUrl("monstera.jpeg"),
    category: "Indoor Plants",
    subcategory: "Decorative Plants",
    description: "A stunning tropical plant with large, split leaves that brings a touch of the jungle to your home. Perfect for modern interiors.",
    careInstructions: "Water when top inch of soil is dry. Mist leaves weekly. Provide bright, indirect light.",
    lightRequirements: "Bright, indirect light",
    wateringSchedule: "Once a week",
    soilType: "Well-draining potting mix",
    size: "Medium (30-40cm)",
    rating: 4.8,
    reviews: 127,
    inStock: true,
    tags: ["Low Maintenance", "Air Purifying", "Trending"]
  },
  {
    id: "2",
    name: "Peace Lily",
    price: 899,
    image: getPlantImageUrl("Peace Lily.jpeg"),
    category: "Indoor Plants",
    subcategory: "Flowering Plants",
    description: "Elegant white blooms and glossy green leaves. Known for its air-purifying qualities and easy care.",
    careInstructions: "Keep soil moist but not soggy. Place in low to bright indirect light. Blooms year-round.",
    lightRequirements: "Low to bright indirect light",
    wateringSchedule: "Twice a week",
    soilType: "Rich, well-draining soil",
    size: "Small (20-30cm)",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ["Air Purifying", "Flowering", "Low Light"]
  },
  {
    id: "3",
    name: "Snake Plant (Sansevieria)",
    price: 799,
    originalPrice: 999,
    image: getPlantImageUrl("Snake Plant.jpeg"),
    category: "Indoor Plants",
    subcategory: "Decorative Plants",
    description: "Extremely low-maintenance plant with striking vertical leaves. Perfect for beginners and busy lifestyles.",
    careInstructions: "Water sparingly - once every 2-3 weeks. Thrives in low light conditions.",
    lightRequirements: "Low to bright light",
    wateringSchedule: "Every 2-3 weeks",
    soilType: "Cactus/succulent mix",
    size: "Medium (25-35cm)",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    tags: ["Low Maintenance", "Air Purifying", "Beginner Friendly"]
  },
  {
    id: "4",
    name: "Rose Plant (Red)",
    price: 1599,
    image: getPlantImageUrl("rose plant.jpeg"),
    category: "Outdoor Plants",
    subcategory: "Flowering Plants",
    description: "Classic red roses that bloom beautifully in your garden. Perfect for gifting and romantic occasions.",
    careInstructions: "Plant in well-draining soil. Water deeply once a week. Provide 6+ hours of direct sunlight.",
    lightRequirements: "Full sun (6+ hours)",
    wateringSchedule: "Once a week",
    soilType: "Well-draining garden soil",
    size: "Large (40-50cm)",
    rating: 4.7,
    reviews: 93,
    inStock: true,
    tags: ["Flowering", "Garden", "Gift"]
  },
  {
    id: "5",
    name: "Aloe Vera",
    price: 599,
    image: getPlantImageUrl("aloe vera.jpeg"),
    category: "Indoor Plants",
    subcategory: "Succulents",
    description: "Medicinal succulent with healing properties. Easy to care for and great for skin treatments.",
    careInstructions: "Water deeply but infrequently. Allow soil to dry completely between waterings.",
    lightRequirements: "Bright, direct light",
    wateringSchedule: "Every 2 weeks",
    soilType: "Cactus/succulent mix",
    size: "Small (15-25cm)",
    rating: 4.5,
    reviews: 74,
    inStock: true,
    tags: ["Medicinal", "Low Maintenance", "Succulent"]
  },
  {
    id: "6",
    name: "Lemon Tree",
    price: 2499,
    image: getPlantImageUrl("lemon tree.jpeg"),
    category: "Outdoor Plants",
    subcategory: "Fruit Plants",
    description: "Dwarf lemon tree perfect for patios and small gardens. Produces fragrant flowers and edible lemons.",
    careInstructions: "Plant in large container. Water regularly during growing season. Fertilize monthly.",
    lightRequirements: "Full sun",
    wateringSchedule: "2-3 times a week",
    soilType: "Well-draining potting mix",
    size: "Large (60-80cm)",
    rating: 4.4,
    reviews: 67,
    inStock: true,
    tags: ["Fruit Bearing", "Outdoor", "Citrus"]
  },
  {
    id: "7",
    name: "Jasmine Plant",
    price: 1199,
    image: getPlantImageUrl("jasmine plant.jpeg"),
    category: "Outdoor Plants",
    subcategory: "Flowering Plants",
    description: "Fragrant white flowers that bloom at night. Perfect for trellises and garden borders.",
    careInstructions: "Plant in well-draining soil. Water regularly during blooming season. Prune after flowering.",
    lightRequirements: "Full sun to partial shade",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining garden soil",
    size: "Medium (35-45cm)",
    rating: 4.8,
    reviews: 85,
    inStock: true,
    tags: ["Fragrant", "Flowering", "Climbing"]
  },
  {
    id: "8",
    name: "Jade Plant (Crassula Ovata)",
    price: 899,
    originalPrice: 1199,
    image: getPlantImageUrl("aloe vera.jpeg"), // Using aloe vera image as placeholder
    category: "Indoor Plants",
    subcategory: "Succulents",
    description: "A beautiful succulent with thick, glossy leaves that symbolize good luck and prosperity. Perfect for beginners and low-maintenance plant lovers.",
    careInstructions: "Water when soil is completely dry. Allow soil to dry out between waterings. Thrives in bright, indirect light.",
    lightRequirements: "Bright, indirect light",
    wateringSchedule: "Every 2-3 weeks",
    soilType: "Cactus/succulent mix",
    size: "Small (15-25cm)",
    rating: 4.7,
    reviews: 92,
    inStock: true,
    tags: ["Succulent", "Low Maintenance", "Good Luck", "Beginner Friendly"]
  },
  {
    id: "9",
    name: "Piper Plant (Betel Leaf)",
    price: 699,
    image: getPlantImageUrl("Peace Lily.jpeg"), // Using Peace Lily image as placeholder
    category: "Indoor Plants",
    subcategory: "Decorative Plants",
    description: "An attractive climbing plant with heart-shaped leaves. Known for its air-purifying qualities and easy care requirements.",
    careInstructions: "Keep soil consistently moist. Provide bright, indirect light. Mist leaves occasionally for humidity.",
    lightRequirements: "Bright, indirect light",
    wateringSchedule: "2-3 times a week",
    soilType: "Well-draining potting mix",
    size: "Medium (25-35cm)",
    rating: 4.5,
    reviews: 78,
    inStock: true,
    tags: ["Climbing", "Air Purifying", "Heart-shaped Leaves", "Easy Care"]
  },
  {
    id: "10",
    name: "Lavender Plant",
    price: 1299,
    image: getPlantImageUrl("rose plant.jpeg"), // Using rose plant image as placeholder
    category: "Indoor Plants",
    subcategory: "Aromatic Plants",
    description: "Fragrant purple flowers with a calming aroma. Perfect for indoor herb gardens and aromatherapy. Adds beauty and fragrance to any space.",
    careInstructions: "Water when top inch of soil is dry. Provide plenty of bright light. Prune regularly to maintain shape.",
    lightRequirements: "Bright, direct light",
    wateringSchedule: "Once a week",
    soilType: "Well-draining, slightly alkaline soil",
    size: "Medium (20-30cm)",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    tags: ["Aromatic", "Purple Flowers", "Calming", "Herb Garden"]
  }
];

const categories = [
  "All Plants",
  "Indoor Plants",
  "Outdoor Plants",
  "Flowering Plants",
  "Decorative Plants",
  "Fruit Plants",
  "Succulents",
  "Aromatic Plants"
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" }
];

interface PlantsPageProps {
  onAddToCart: (productId: string) => void;
}

export default function PlantsPage({ onAddToCart }: PlantsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Plants");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  // Filter and sort plants
  const filteredAndSortedPlants = useMemo(() => {
    let filtered = samplePlants;

    // Filter by category
    if (selectedCategory !== "All Plants") {
      filtered = filtered.filter(plant => 
        plant.category === selectedCategory || plant.subcategory === selectedCategory
      );
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
        // For demo purposes, reverse the array
        filtered.reverse();
        break;
      default:
        // Featured - keep original order
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
              <h1 className="text-3xl font-bold text-gray-900">Plants</h1>
              <p className="text-gray-600 mt-1">
                Discover our collection of {filteredAndSortedPlants.length} beautiful plants
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
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => setSelectedPlant(plant)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                            
                            <Button 
                              className="flex-1"
                              onClick={() => onAddToCart(plant.id)}
                              disabled={!plant.inStock}
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedPlant(plant)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                            
                            <Button 
                              size="sm"
                              onClick={() => onAddToCart(plant.id)}
                              disabled={!plant.inStock}
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
                    onAddToCart(selectedPlant.id);
                    setSelectedPlant(null);
                  }}
                  disabled={!selectedPlant.inStock}
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
