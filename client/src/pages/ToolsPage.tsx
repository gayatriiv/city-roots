import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List, ShoppingCart, Eye, Heart, Star, Wrench, Droplets, Scissors, Sun } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Tool {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

// Sample tools data with INR prices
const sampleTools: Tool[] = [
  {
    id: "1",
    name: "Professional Pruning Shears",
    price: 1299,
    originalPrice: 1599,
    image: "/images/gardening-tools.jpg",
    category: "Hand Tools",
    description: "High-quality stainless steel pruning shears perfect for trimming plants and flowers. Ergonomic design for comfortable use.",
    features: ["Stainless steel blades", "Ergonomic handle", "Safety lock", "5-year warranty"],
    rating: 4.8,
    reviews: 127,
    inStock: true,
    tags: ["Professional", "Durable", "Ergonomic"]
  },
  {
    id: "2",
    name: "Watering Can Set",
    price: 899,
    image: "/images/gardening-tools.jpg",
    category: "Watering Equipment",
    description: "Complete watering can set with fine rose attachment for gentle watering of seedlings and delicate plants.",
    features: ["2L capacity", "Fine rose attachment", "Comfortable grip", "Durable plastic"],
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ["Gentle Watering", "Versatile", "Easy to Use"]
  },
  {
    id: "3",
    name: "Garden Trowel Set",
    price: 799,
    originalPrice: 999,
    image: "/images/gardening-tools.jpg",
    category: "Hand Tools",
    description: "Set of three stainless steel trowels for digging, planting, and soil preparation. Essential for any gardener.",
    features: ["3 different sizes", "Stainless steel", "Comfortable handles", "Garden bag included"],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    tags: ["Essential", "Multi-purpose", "Durable"]
  },
  {
    id: "4",
    name: "Plant Mister",
    price: 599,
    image: "/images/gardening-tools.jpg",
    category: "Watering Equipment",
    description: "Fine mist sprayer perfect for indoor plants that love humidity. Adjustable nozzle for different spray patterns.",
    features: ["Fine mist", "Adjustable nozzle", "500ml capacity", "Easy to clean"],
    rating: 4.5,
    reviews: 74,
    inStock: true,
    tags: ["Indoor Plants", "Humidity", "Adjustable"]
  },
  {
    id: "5",
    name: "LED Grow Light",
    price: 2499,
    image: "/images/gardening-tools.jpg",
    category: "Lighting",
    description: "Full spectrum LED grow light perfect for indoor gardening. Energy efficient and promotes healthy plant growth.",
    features: ["Full spectrum LED", "Energy efficient", "Timer function", "Adjustable height"],
    rating: 4.9,
    reviews: 93,
    inStock: true,
    tags: ["LED", "Energy Efficient", "Full Spectrum"]
  },
  {
    id: "6",
    name: "Soil Moisture Meter",
    price: 899,
    image: "/images/gardening-tools.jpg",
    category: "Monitoring",
    description: "Digital soil moisture meter to help you water your plants at the right time. No batteries required.",
    features: ["Digital display", "No batteries needed", "Probe length: 7.6cm", "Easy to read"],
    rating: 4.4,
    reviews: 67,
    inStock: true,
    tags: ["Digital", "No Batteries", "Accurate"]
  }
];

const categories = [
  "All Tools",
  "Hand Tools",
  "Watering Equipment",
  "Lighting",
  "Monitoring",
  "Power Tools"
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
  "Hand Tools": Wrench,
  "Watering Equipment": Droplets,
  "Lighting": Sun,
  "Monitoring": Eye,
  "Power Tools": Scissors,
  "All Tools": Filter
};

interface ToolsPageProps {
  onAddToCart: (productId: string) => void;
}

export default function ToolsPage({ onAddToCart }: ToolsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Tools");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Filter and sort tools
  const filteredAndSortedTools = useMemo(() => {
    let filtered = sampleTools;

    // Filter by category
    if (selectedCategory !== "All Tools") {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort tools
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
              <h1 className="text-3xl font-bold text-gray-900">Garden Tools</h1>
              <p className="text-gray-600 mt-1">
                Professional tools for every gardener
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
                Search Tools
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
              {filteredAndSortedTools.map((tool) => (
                <Card key={tool.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {viewMode === "grid" ? (
                      // Grid View
                      <div>
                        <div className="relative aspect-square overflow-hidden rounded-t-lg">
                          <img
                            src={tool.image}
                            alt={tool.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {tool.originalPrice && (
                            <Badge className="absolute top-2 left-2 bg-red-500">
                              {Math.round((1 - tool.price / tool.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                          {!tool.inStock && (
                            <Badge variant="secondary" className="absolute top-2 right-2">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                              {tool.name}
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
                            {tool.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {renderStars(tool.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              ({tool.reviews})
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(tool.price)}
                              </span>
                              {tool.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(tool.originalPrice)}
                                </span>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {tool.category}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => setSelectedTool(tool)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                            
                            <Button 
                              className="flex-1"
                              onClick={() => onAddToCart(tool.id)}
                              disabled={!tool.inStock}
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
                            src={tool.image}
                            alt={tool.name}
                            className="w-full h-full object-cover"
                          />
                          {tool.originalPrice && (
                            <Badge className="absolute top-1 left-1 bg-red-500 text-xs">
                              {Math.round((1 - tool.price / tool.originalPrice) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {tool.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Badge variant="outline" className="text-xs">
                                {tool.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {tool.description}
                          </p>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {renderStars(tool.rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                ({tool.reviews} reviews)
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(tool.price)}
                              </span>
                              {tool.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(tool.originalPrice)}
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
                                  onClick={() => setSelectedTool(tool)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                            
                            <Button 
                              size="sm"
                              onClick={() => onAddToCart(tool.id)}
                              disabled={!tool.inStock}
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
            {filteredAndSortedTools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tools found
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
      {selectedTool && (
        <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedTool.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={selectedTool.image}
                  alt={selectedTool.name}
                  className="w-full h-full object-cover"
                />
                {selectedTool.originalPrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {Math.round((1 - selectedTool.price / selectedTool.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Price and Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(selectedTool.price)}
                  </span>
                  {selectedTool.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(selectedTool.originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(selectedTool.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({selectedTool.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Description</h4>
                <p className="text-gray-600">{selectedTool.description}</p>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {selectedTool.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Features</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTool.tags.map((tag) => (
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
                    onAddToCart(selectedTool.id);
                    setSelectedTool(null);
                  }}
                  disabled={!selectedTool.inStock}
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
