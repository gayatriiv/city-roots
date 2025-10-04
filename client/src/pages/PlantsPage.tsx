import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List, ShoppingCart, Eye, Heart, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getImageUrl } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

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

// All plants data with INR prices - organized by the 5 main categories
const samplePlants: Plant[] = [
  // 🏡 INDOOR PLANTS
  {
    id: "1",
    name: "Money Plant (Pothos)",
    price: 599,
    image: getPlantImageUrl("money plant.jpeg"),
    category: "Indoor Plants",
    subcategory: "Indoor",
    description: "Popular trailing plant that's easy to care for and brings good luck. Perfect for beginners.",
    careInstructions: "Water when soil is dry. Provide bright, indirect light. Can tolerate low light conditions.",
    lightRequirements: "Bright, indirect light to low light",
    wateringSchedule: "Once a week",
    soilType: "Well-draining potting mix",
    size: "Small (15-30cm)",
    rating: 4.8,
    reviews: 198,
    inStock: true,
    tags: ["Easy Care", "Trailing", "Good Luck", "Beginner Friendly"]
  },
  {
    id: "2",
    name: "ZZ Plant",
    price: 1299,
    image: getPlantImageUrl("zz plant.jpeg"),
    category: "Indoor Plants",
    subcategory: "Indoor",
    description: "Extremely low-maintenance plant with glossy, dark green leaves. Perfect for busy people and low-light areas.",
    careInstructions: "Water sparingly - once every 2-3 weeks. Thrives in low light. Very drought tolerant.",
    lightRequirements: "Low to bright indirect light",
    wateringSchedule: "Every 2-3 weeks",
    soilType: "Well-draining potting mix",
    size: "Medium (30-50cm)",
    rating: 4.9,
    reviews: 145,
    inStock: true,
    tags: ["Low Maintenance", "Drought Tolerant", "Glossy", "Low Light"]
  },
  {
    id: "3",
    name: "Spider Plant",
    price: 799,
    image: getPlantImageUrl("Spider Plant.jpeg"),
    category: "Indoor Plants",
    subcategory: "Indoor",
    description: "Easy-care plant that produces baby plantlets. Great for hanging baskets and air purification.",
    careInstructions: "Water when soil is dry. Provide bright, indirect light. Remove baby plantlets to encourage growth.",
    lightRequirements: "Bright, indirect light",
    wateringSchedule: "Once a week",
    soilType: "Well-draining potting mix",
    size: "Medium (25-40cm)",
    rating: 4.7,
    reviews: 123,
    inStock: true,
    tags: ["Easy Care", "Air Purifying", "Baby Plantlets", "Hanging"]
  },
  {
    id: "4",
    name: "Rubber Plant",
    price: 1499,
    image: getPlantImageUrl("rubber plant.jpeg"),
    category: "Indoor Plants",
    subcategory: "Indoor",
    description: "Sturdy plant with large, glossy leaves. Perfect for adding height and drama to your indoor space.",
    careInstructions: "Water when top inch of soil is dry. Provide bright, indirect light. Wipe leaves occasionally.",
    lightRequirements: "Bright, indirect light",
    wateringSchedule: "Once a week",
    soilType: "Well-draining potting mix",
    size: "Large (60-100cm)",
    rating: 4.6,
    reviews: 87,
    inStock: true,
    tags: ["Large Leaves", "Glossy", "Sturdy", "Dramatic"]
  },
  {
    id: "5",
    name: "Monstera Deliciosa",
    price: 1299,
    originalPrice: 1599,
    image: getPlantImageUrl("monstera.jpeg"),
    category: "Indoor Plants",
    subcategory: "Indoor",
    description: "A stunning tropical plant with large, split leaves that brings a touch of the jungle to your home. Perfect for modern interiors.",
    careInstructions: "Water when top inch of soil is dry. Mist leaves weekly. Provide bright, indirect light.",
    lightRequirements: "Bright, indirect light",
    wateringSchedule: "Once a week",
    soilType: "Well-draining potting mix",
    size: "Medium (30-40cm)",
    rating: 4.8,
    reviews: 127,
    inStock: true,
    tags: ["Low Maintenance", "Air Purifying", "Trending", "Split Leaves"]
  },
  {
    id: "6",
    name: "Peace Lily",
    price: 899,
    image: getPlantImageUrl("Peace Lily.jpeg"),
    category: "Indoor Plants",
    subcategory: "Indoor",
    description: "Elegant white blooms and glossy green leaves. Known for its air-purifying qualities and easy care.",
    careInstructions: "Keep soil moist but not soggy. Place in low to bright indirect light. Blooms year-round.",
    lightRequirements: "Low to bright indirect light",
    wateringSchedule: "Twice a week",
    soilType: "Rich, well-draining soil",
    size: "Small (20-30cm)",
    rating: 4.6,
    reviews: 89,
    inStock: true,
    tags: ["Air Purifying", "White Flowers", "Low Light", "Easy Care"]
  },
  {
    id: "7",
    name: "Aloe Vera",
    price: 599,
    image: getPlantImageUrl("aloe vera.jpeg"),
    category: "Indoor Plants",
    subcategory: "Indoor",
    description: "Medicinal succulent with healing properties. Easy to care for and great for skin treatments.",
    careInstructions: "Water deeply but infrequently. Allow soil to dry completely between waterings.",
    lightRequirements: "Bright, direct light",
    wateringSchedule: "Every 2 weeks",
    soilType: "Cactus/succulent mix",
    size: "Small (15-25cm)",
    rating: 4.5,
    reviews: 74,
    inStock: true,
    tags: ["Medicinal", "Low Maintenance", "Succulent", "Healing"]
  },

  // 🌳 OUTDOOR PLANTS
  {
    id: "8",
    name: "Neem Plant",
    price: 999,
    image: getPlantImageUrl("neem plant.jpeg"),
    category: "Outdoor Plants",
    subcategory: "Outdoor",
    description: "Medicinal tree with numerous health benefits. Natural pest repellent and air purifier for your garden.",
    careInstructions: "Plant in well-draining soil. Water regularly during dry periods. Prune to maintain shape.",
    lightRequirements: "Full sun to partial shade",
    wateringSchedule: "Once a week",
    soilType: "Well-draining garden soil",
    size: "Large (100-150cm)",
    rating: 4.5,
    reviews: 92,
    inStock: true,
    tags: ["Medicinal", "Pest Repellent", "Air Purifying", "Health Benefits"]
  },
  {
    id: "9",
    name: "Tulsi Plant (Holy Basil)",
    price: 699,
    image: getPlantImageUrl("tulsi plant.jpeg"),
    category: "Outdoor Plants",
    subcategory: "Outdoor",
    description: "Sacred plant with medicinal properties. Used in Ayurveda and perfect for home gardens and religious purposes.",
    careInstructions: "Plant in well-draining soil. Water regularly. Pinch flowers to encourage leaf growth.",
    lightRequirements: "Full sun to partial shade",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining garden soil",
    size: "Small (20-40cm)",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    tags: ["Sacred", "Medicinal", "Ayurveda", "Religious"]
  },
  {
    id: "10",
    name: "Ashwagandha Plant",
    price: 1199,
    image: getPlantImageUrl("ashwagandha.jpeg"),
    category: "Outdoor Plants",
    subcategory: "Outdoor",
    description: "Medicinal herb known for its adaptogenic properties. Used in traditional medicine for stress relief and vitality.",
    careInstructions: "Plant in well-draining soil. Water regularly. Harvest roots after 2-3 years of growth.",
    lightRequirements: "Full sun to partial shade",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining garden soil",
    size: "Medium (40-60cm)",
    rating: 4.4,
    reviews: 78,
    inStock: true,
    tags: ["Medicinal", "Adaptogenic", "Stress Relief", "Traditional Medicine"]
  },

  // 🌸 FLOWERING PLANTS
  {
    id: "11",
    name: "Hibiscus Plant",
    price: 1299,
    image: getPlantImageUrl("hibiscus-plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Flowering",
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
    id: "12",
    name: "Rose Plant",
    price: 1599,
    image: getPlantImageUrl("rose plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Flowering",
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
    id: "13",
    name: "Marigold Plant",
    price: 599,
    image: getPlantImageUrl("marigold plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Flowering",
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
    id: "14",
    name: "Bougainvillea Plant",
    price: 1899,
    image: getPlantImageUrl("bougainvillea-plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Flowering",
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
    id: "15",
    name: "Sunflower Plant",
    price: 799,
    image: getPlantImageUrl("sunflower-plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Flowering",
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
    id: "16",
    name: "Jasmine Plant",
    price: 1199,
    image: getPlantImageUrl("jasmine plant.jpeg"),
    category: "Flowering Plants",
    subcategory: "Flowering",
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

  // 🎍 DECORATIVE PLANTS
  {
    id: "17",
    name: "Snake Plant (Sansevieria)",
    price: 799,
    originalPrice: 999,
    image: getPlantImageUrl("Snake Plant.jpeg"),
    category: "Decorative Plants",
    subcategory: "Decorative",
    description: "Extremely low-maintenance plant with striking vertical leaves. Perfect for beginners and busy lifestyles.",
    careInstructions: "Water sparingly - once every 2-3 weeks. Thrives in low light conditions.",
    lightRequirements: "Low to bright light",
    wateringSchedule: "Every 2-3 weeks",
    soilType: "Cactus/succulent mix",
    size: "Medium (25-35cm)",
    rating: 4.9,
    reviews: 156,
    inStock: true,
    tags: ["Low Maintenance", "Air Purifying", "Beginner Friendly", "Vertical"]
  },
  {
    id: "18",
    name: "Areca Palm Plant",
    price: 1899,
    image: getPlantImageUrl("areca palm plant.jpeg"),
    category: "Decorative Plants",
    subcategory: "Decorative",
    description: "Elegant palm with feathery fronds that adds tropical beauty to any space. Excellent air purifier.",
    careInstructions: "Keep soil consistently moist. Provide bright, indirect light. Mist leaves regularly for humidity.",
    lightRequirements: "Bright, indirect light",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining potting mix",
    size: "Large (60-80cm)",
    rating: 4.7,
    reviews: 134,
    inStock: true,
    tags: ["Tropical", "Air Purifying", "Feathery", "Elegant"]
  },
  {
    id: "19",
    name: "Fiddle Leaf Fig",
    price: 2499,
    image: getPlantImageUrl("fidde leaf plant.jpeg"),
    category: "Decorative Plants",
    subcategory: "Decorative",
    description: "Trendy houseplant with large, violin-shaped leaves. Perfect statement piece for modern interiors.",
    careInstructions: "Water when top inch of soil is dry. Provide bright, indirect light. Rotate regularly for even growth.",
    lightRequirements: "Bright, indirect light",
    wateringSchedule: "Once a week",
    soilType: "Well-draining potting mix",
    size: "Large (80-120cm)",
    rating: 4.8,
    reviews: 167,
    inStock: true,
    tags: ["Trendy", "Statement Plant", "Large Leaves", "Modern"]
  },
  {
    id: "20",
    name: "Croton Plant",
    price: 1299,
    image: getPlantImageUrl("croton plant.jpeg"),
    category: "Decorative Plants",
    subcategory: "Decorative",
    description: "Colorful plant with vibrant, variegated leaves in shades of red, orange, and yellow. Adds tropical flair.",
    careInstructions: "Keep soil moist. Provide bright, indirect light. Higher humidity preferred.",
    lightRequirements: "Bright, indirect light",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining potting mix",
    size: "Medium (30-50cm)",
    rating: 4.5,
    reviews: 98,
    inStock: true,
    tags: ["Colorful", "Variegated", "Tropical", "Vibrant"]
  },
  {
    id: "21",
    name: "Bamboo Plant (Lucky Bamboo)",
    price: 699,
    image: getPlantImageUrl("bamboo plant.jpeg"),
    category: "Decorative Plants",
    subcategory: "Decorative",
    description: "Symbol of good luck and prosperity. Easy to care for and perfect for feng shui arrangements.",
    careInstructions: "Keep in water or well-draining soil. Change water weekly if growing in water. Provide indirect light.",
    lightRequirements: "Indirect light",
    wateringSchedule: "Weekly water change",
    soilType: "Water or well-draining soil",
    size: "Small (20-40cm)",
    rating: 4.6,
    reviews: 112,
    inStock: true,
    tags: ["Good Luck", "Feng Shui", "Easy Care", "Prosperity"]
  },

  // 🍎 FRUIT PLANTS
  {
    id: "22",
    name: "Mango Plant",
    price: 2199,
    image: getPlantImageUrl("mango plant.jpeg"),
    category: "Fruit Plants",
    subcategory: "Fruit",
    description: "Tropical fruit tree that produces sweet, juicy mangoes. Perfect for gardens and large containers.",
    careInstructions: "Plant in well-draining soil. Water regularly during growing season. Fertilize monthly with fruit tree fertilizer.",
    lightRequirements: "Full sun",
    wateringSchedule: "2-3 times a week",
    soilType: "Well-draining garden soil",
    size: "Large (80-120cm)",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    tags: ["Fruit Bearing", "Tropical", "Sweet", "Large Tree"]
  },
  {
    id: "23",
    name: "Guava Plant",
    price: 1899,
    image: getPlantImageUrl("guava plant.jpeg"),
    category: "Fruit Plants",
    subcategory: "Fruit",
    description: "Fast-growing fruit tree that produces sweet, aromatic guavas. Great for home gardens.",
    careInstructions: "Plant in well-draining soil. Water regularly. Prune to maintain shape and encourage fruiting.",
    lightRequirements: "Full sun to partial shade",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining garden soil",
    size: "Medium (60-80cm)",
    rating: 4.6,
    reviews: 76,
    inStock: true,
    tags: ["Fruit Bearing", "Fast Growing", "Aromatic", "Sweet"]
  },
  {
    id: "24",
    name: "Banana Plant",
    price: 1599,
    image: getPlantImageUrl("banana plant.jpeg"),
    category: "Fruit Plants",
    subcategory: "Fruit",
    description: "Tropical plant that produces sweet bananas. Adds exotic beauty to your garden.",
    careInstructions: "Plant in rich, well-draining soil. Water regularly and keep soil moist. Protect from strong winds.",
    lightRequirements: "Full sun",
    wateringSchedule: "Daily during hot weather",
    soilType: "Rich, well-draining soil",
    size: "Large (100-150cm)",
    rating: 4.5,
    reviews: 67,
    inStock: true,
    tags: ["Tropical", "Fruit Bearing", "Exotic", "Large"]
  },
  {
    id: "25",
    name: "Lemon Tree",
    price: 2499,
    image: getPlantImageUrl("lemon tree.jpeg"),
    category: "Fruit Plants",
    subcategory: "Fruit",
    description: "Dwarf lemon tree perfect for patios and small gardens. Produces fragrant flowers and edible lemons.",
    careInstructions: "Plant in large container. Water regularly during growing season. Fertilize monthly.",
    lightRequirements: "Full sun",
    wateringSchedule: "2-3 times a week",
    soilType: "Well-draining potting mix",
    size: "Large (60-80cm)",
    rating: 4.4,
    reviews: 67,
    inStock: true,
    tags: ["Fruit Bearing", "Citrus", "Fragrant", "Dwarf"]
  },
  {
    id: "26",
    name: "Papaya Plant",
    price: 1799,
    image: getPlantImageUrl("papaya plant.jpeg"),
    category: "Fruit Plants",
    subcategory: "Fruit",
    description: "Fast-growing tropical tree that produces sweet, nutritious papayas. Perfect for warm climates.",
    careInstructions: "Plant in well-draining soil. Water regularly. Protect from frost and strong winds.",
    lightRequirements: "Full sun",
    wateringSchedule: "Twice a week",
    soilType: "Well-draining garden soil",
    size: "Large (80-120cm)",
    rating: 4.3,
    reviews: 54,
    inStock: true,
    tags: ["Tropical", "Fast Growing", "Nutritious", "Warm Climate"]
  }
];

const categories = [
  "All Plants",
  "Indoor Plants",
  "Outdoor Plants",
  "Flowering Plants",
  "Decorative Plants",
  "Fruit Plants"
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
  const [location, setLocation] = useLocation();
  const { addToCart, isInCart, getTotalItems } = useCart();

  console.log('PlantsPage rendered with selectedCategory:', selectedCategory);

  // Handle URL category parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    console.log('URL category parameter:', categoryParam);
    console.log('Current location:', location);
    if (categoryParam) {
      console.log('Setting selected category to:', categoryParam);
      setSelectedCategory(categoryParam);
    } else {
      // Reset to "All Plants" if no category parameter
      setSelectedCategory("All Plants");
    }
  }, [location]);

  const handlePlantClick = (plantId: string) => {
    setLocation(`/product/${plantId}`);
  };

  const handleAddToCart = (plant: Plant) => {
    console.log('PlantsPage: Adding plant to cart:', plant.name, plant.id);
    addToCart(plant);
    onAddToCart(plant.id);
  };

  // Filter and sort plants
  const filteredAndSortedPlants = useMemo(() => {
    let filtered = samplePlants;
    
    console.log('Current selectedCategory state:', selectedCategory);

    // Filter by category
    if (selectedCategory !== "All Plants") {
      console.log('Filtering by category:', selectedCategory);
      console.log('Available plants before filter:', samplePlants.length);
      
      filtered = filtered.filter(plant => {
        const matches = plant.category === selectedCategory || plant.subcategory === selectedCategory;
        if (matches) {
          console.log('Found matching plant:', plant.name, 'Category:', plant.category, 'Subcategory:', plant.subcategory);
        }
        return matches;
      });
      
      console.log('Filtered plants count:', filtered.length);
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
                <Card key={plant.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    {viewMode === "grid" ? (
                      // Grid View
                      <div className="flex flex-col h-full">
                        <div 
                          className="relative aspect-square overflow-hidden cursor-pointer"
                          onClick={() => handlePlantClick(plant.id)}
                        >
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
                        
                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 
                              className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors cursor-pointer"
                              onClick={() => handlePlantClick(plant.id)}
                            >
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
                          
                          <div className="flex gap-2 mt-auto pt-3">
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
                        <div 
                          className="relative w-32 h-32 flex-shrink-0 cursor-pointer"
                          onClick={() => handlePlantClick(plant.id)}
                        >
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
                            <h3 
                              className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-primary transition-colors"
                              onClick={() => handlePlantClick(plant.id)}
                            >
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
                          
                          <div className="flex gap-2 flex-shrink-0">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                              className="text-xs min-w-0"
                              onClick={() => handlePlantClick(plant.id)}
                                >
                              <Eye className="h-3 w-3 mr-1" />
                              <span className="truncate">View Details</span>
                                </Button>
                            
                            <Button 
                              size="sm"
                              className="text-xs min-w-0"
                              onClick={() => handleAddToCart(plant)}
                              disabled={!plant.inStock}
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              <span className="truncate">{isInCart(plant.id) ? 'Added' : 'Add to Cart'}</span>
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
