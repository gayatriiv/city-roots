import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List, Clock, User, BookOpen, Star, Leaf, Wrench, Sprout } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  difficulty: string;
  readTime: string;
  author: string;
  category: string;
  featured: boolean;
  rating: number;
  reviews: number;
  tags: string[];
}

// Sample guides data
const sampleGuides: Guide[] = [
  {
    id: "1",
    title: "Starting Your First Garden: A Complete Beginner's Guide",
    description: "Everything you need to know to start your gardening journey, from choosing the right location to planting your first seeds.",
    content: "This comprehensive guide covers all the basics of starting a garden. We'll walk you through choosing the right location, preparing your soil, selecting plants, and maintaining your garden throughout the seasons. Perfect for complete beginners who want to start their gardening adventure.",
    image: "/images/hero.jpg",
    difficulty: "Beginner",
    readTime: "8 min read",
    author: "Sarah Johnson",
    category: "Getting Started",
    featured: true,
    rating: 4.8,
    reviews: 127,
    tags: ["Beginner", "Complete Guide", "Garden Setup"]
  },
  {
    id: "2",
    title: "Master the Art of Starting Seeds Indoors",
    description: "Learn professional techniques for starting seeds indoors to get a head start on the growing season.",
    content: "Starting seeds indoors is a great way to get a jump on the growing season. This guide covers everything from choosing the right containers and soil to proper lighting and watering techniques. You'll learn how to create the perfect environment for your seedlings to thrive.",
    image: "/images/seeds.jpg",
    difficulty: "Intermediate",
    readTime: "12 min read",
    author: "Mike Chen",
    category: "Seed Starting",
    featured: true,
    rating: 4.6,
    reviews: 89,
    tags: ["Indoor Growing", "Seed Starting", "Techniques"]
  },
  {
    id: "3",
    title: "Essential Tools Every Gardener Should Own",
    description: "Discover the must-have tools that will make your gardening tasks easier and more efficient.",
    content: "Having the right tools can make all the difference in your gardening success. This guide covers the essential tools every gardener should have, from basic hand tools to specialized equipment. Learn about tool maintenance and how to choose quality tools that will last for years.",
    image: "/images/gardening-tools.jpg",
    difficulty: "Beginner",
    readTime: "6 min read",
    author: "Emma Davis",
    category: "Tools & Equipment",
    featured: true,
    rating: 4.7,
    reviews: 156,
    tags: ["Tools", "Equipment", "Essential"]
  },
  {
    id: "4",
    title: "Indoor Plant Care: Complete Guide to Houseplant Success",
    description: "Master the art of indoor plant care with our comprehensive guide to keeping houseplants healthy and thriving.",
    content: "Indoor plants can transform your living space and improve air quality. This guide covers everything from choosing the right plants for your space to proper watering, lighting, and fertilization techniques. Learn how to troubleshoot common problems and keep your indoor garden looking its best.",
    image: "/images/Peace Lily.jpeg",
    difficulty: "Beginner",
    readTime: "10 min read",
    author: "Lisa Park",
    category: "Indoor Gardening",
    featured: false,
    rating: 4.9,
    reviews: 203,
    tags: ["Indoor Plants", "Houseplants", "Care Guide"]
  },
  {
    id: "5",
    title: "Seasonal Gardening: What to Plant and When",
    description: "Learn about seasonal planting schedules and how to maximize your garden's potential year-round.",
    content: "Understanding seasonal gardening is key to a successful harvest. This guide breaks down what to plant in each season, how to prepare your garden for seasonal changes, and tips for extending your growing season. Perfect for gardeners who want to maximize their yields.",
    image: "/images/rose plant.jpeg",
    difficulty: "Intermediate",
    readTime: "15 min read",
    author: "David Wilson",
    category: "Seasonal Gardening",
    featured: false,
    rating: 4.5,
    reviews: 78,
    tags: ["Seasonal", "Planting Schedule", "Year-Round"]
  },
  {
    id: "6",
    title: "Organic Pest Control: Natural Solutions for Garden Problems",
    description: "Discover eco-friendly methods to control pests and diseases in your garden without harmful chemicals.",
    content: "Learn how to protect your garden using natural, organic methods. This guide covers companion planting, beneficial insects, homemade remedies, and preventive measures to keep your garden healthy and pest-free. Safe for the environment and your family.",
    image: "/images/monstera.jpeg",
    difficulty: "Intermediate",
    readTime: "11 min read",
    author: "Rachel Green",
    category: "Pest Control",
    featured: false,
    rating: 4.8,
    reviews: 134,
    tags: ["Organic", "Pest Control", "Natural Solutions"]
  }
];

const categories = [
  "All Guides",
  "Getting Started",
  "Seed Starting",
  "Tools & Equipment",
  "Indoor Gardening",
  "Seasonal Gardening",
  "Pest Control"
];

const difficultyLevels = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced"
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "read-time", label: "Reading Time" },
  { value: "title", label: "Title A-Z" }
];

const categoryIcons = {
  "Getting Started": Leaf,
  "Seed Starting": Sprout,
  "Tools & Equipment": Wrench,
  "Indoor Gardening": Leaf,
  "Seasonal Gardening": Leaf,
  "Pest Control": Leaf,
  "All Guides": BookOpen
};

interface GuidesPageProps {
  onGuideClick?: (guideId: string) => void;
}

export default function GuidesPage({ onGuideClick }: GuidesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Guides");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  // Filter and sort guides
  const filteredAndSortedGuides = useMemo(() => {
    let filtered = sampleGuides;

    // Filter by category
    if (selectedCategory !== "All Guides") {
      filtered = filtered.filter(guide => guide.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== "All Levels") {
      filtered = filtered.filter(guide => guide.difficulty === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(guide =>
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort guides
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.reverse();
        break;
      case "read-time":
        filtered.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Featured - show featured first, then by rating
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return filtered;
  }, [selectedCategory, selectedDifficulty, sortBy, searchQuery]);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gardening Guides</h1>
              <p className="text-gray-600 mt-1">
                Expert tips and comprehensive guides for every gardener
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
                Search Guides
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search guides..."
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

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {difficultyLevels.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedDifficulty === difficulty
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {difficulty}
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

          {/* Guides Grid/List */}
          <div className="flex-1">
            <div className={`${
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }`}>
              {filteredAndSortedGuides.map((guide) => (
                <Card key={guide.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    {viewMode === "grid" ? (
                      // Grid View
                      <div onClick={() => setSelectedGuide(guide)}>
                        <div className="relative aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={guide.image}
                            alt={guide.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {guide.featured && (
                            <Badge className="absolute top-2 left-2 bg-primary">
                              Featured
                            </Badge>
                          )}
                          <Badge className={`absolute top-2 right-2 ${getDifficultyColor(guide.difficulty)}`}>
                            {guide.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors mb-2 line-clamp-2">
                            {guide.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {guide.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{guide.readTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <User className="h-4 w-4" />
                              <span>{guide.author}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {renderStars(guide.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              ({guide.reviews})
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {guide.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onGuideClick?.(guide.id);
                            }}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Read Guide
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div className="flex" onClick={() => setSelectedGuide(guide)}>
                        <div className="relative w-48 h-32 flex-shrink-0">
                          <img
                            src={guide.image}
                            alt={guide.title}
                            className="w-full h-full object-cover rounded-l-lg"
                          />
                          {guide.featured && (
                            <Badge className="absolute top-1 left-1 bg-primary text-xs">
                              Featured
                            </Badge>
                          )}
                          <Badge className={`absolute top-1 right-1 ${getDifficultyColor(guide.difficulty)} text-xs`}>
                            {guide.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 p-4">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {guide.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {guide.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{guide.readTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{guide.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center">
                                  {renderStars(guide.rating)}
                                </div>
                                <span>({guide.reviews})</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {guide.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onGuideClick?.(guide.id);
                            }}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Read Guide
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredAndSortedGuides.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No guides found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guide Details Modal */}
      {selectedGuide && (
        <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedGuide.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Guide Image */}
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedGuide.image}
                  alt={selectedGuide.title}
                  className="w-full h-full object-cover"
                />
                {selectedGuide.featured && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    Featured
                  </Badge>
                )}
                <Badge className={`absolute top-2 right-2 ${getDifficultyColor(selectedGuide.difficulty)}`}>
                  {selectedGuide.difficulty}
                </Badge>
              </div>

              {/* Guide Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedGuide.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{selectedGuide.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {renderStars(selectedGuide.rating)}
                    </div>
                    <span>({selectedGuide.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Description</h4>
                <p className="text-gray-600">{selectedGuide.description}</p>
              </div>

              {/* Content Preview */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Content Preview</h4>
                <p className="text-gray-600">{selectedGuide.content}</p>
              </div>

              {/* Tags */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Topics Covered</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedGuide.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    onGuideClick?.(selectedGuide.id);
                    setSelectedGuide(null);
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read Full Guide
                </Button>
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
