import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, ShoppingCart, Heart, Star, MapPin, Clock, Droplets, Sun, Leaf, Plus, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
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

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Sample reviews data
const sampleReviews: Review[] = [
  {
    id: "1",
    userName: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely love this plant! It arrived in perfect condition and has been thriving in my living room. The care instructions were spot on.",
    date: "2024-01-15",
    verified: true
  },
  {
    id: "2",
    userName: "Mike Chen",
    rating: 4,
    comment: "Great quality plant. It's been growing well and the leaves are so beautiful. Would definitely recommend to others.",
    date: "2024-01-10",
    verified: true
  },
  {
    id: "3",
    userName: "Emily Rodriguez",
    rating: 5,
    comment: "This is my second plant from VerdantCart and I'm not disappointed. The packaging was excellent and the plant is healthy.",
    date: "2024-01-08",
    verified: true
  },
  {
    id: "4",
    userName: "David Kim",
    rating: 4,
    comment: "Good plant overall. Took a few days to adjust to my home but now it's doing great. The customer service was helpful too.",
    date: "2024-01-05",
    verified: false
  },
  {
    id: "5",
    userName: "Lisa Thompson",
    rating: 5,
    comment: "Perfect addition to my plant collection! The size was exactly as described and it's been very easy to care for.",
    date: "2024-01-02",
    verified: true
  }
];

// Sample plant data (in a real app, this would come from an API)
const samplePlants: Plant[] = [
  {
    id: "1",
    name: "Money Plant (Pothos)",
    price: 599,
    image: "/images/money plant.jpeg",
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
    image: "/images/zz plant.jpeg",
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
    image: "/images/Spider Plant.jpeg",
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
    image: "/images/rubber plant.jpeg",
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
    image: "/images/monstera.jpeg",
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
    image: "/images/Peace Lily.jpeg",
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
    image: "/images/aloe vera.jpeg",
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
  {
    id: "8",
    name: "Neem Plant",
    price: 999,
    image: "/images/neem plant.jpeg",
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
    image: "/images/tulsi plant.jpeg",
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
    image: "/images/ashwagandha.jpeg",
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
  {
    id: "11",
    name: "Hibiscus Plant",
    price: 1299,
    image: "/images/hibiscus-plant.jpeg",
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
    image: "/images/rose plant.jpeg",
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
    image: "/images/marigold plant.jpeg",
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
    image: "/images/bougainvillea-plant.jpeg",
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
    image: "/images/sunflower-plant.jpeg",
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
    image: "/images/jasmine plant.jpeg",
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
  {
    id: "17",
    name: "Snake Plant (Sansevieria)",
    price: 799,
    originalPrice: 999,
    image: "/images/Snake Plant.jpeg",
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
    image: "/images/areca palm plant.jpeg",
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
    image: "/images/fidde leaf plant.jpeg",
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
    image: "/images/croton plant.jpeg",
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
    image: "/images/bamboo plant.jpeg",
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
  {
    id: "22",
    name: "Mango Plant",
    price: 2199,
    image: "/images/mango plant.jpeg",
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
    image: "/images/guava plant.jpeg",
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
    image: "/images/banana plant.jpeg",
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
    image: "/images/lemon tree.jpeg",
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
    image: "/images/papaya plant.jpeg",
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

interface PlantDetailPageProps {
  plantId: string;
  onAddToCart: (productId: string) => void;
}

export default function PlantDetailPage({ plantId, onAddToCart }: PlantDetailPageProps) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });
  const { addToCart, isInCart, getTotalItems } = useCart();
  
  useEffect(() => {
    console.log('PlantDetailPage rendered with plantId:', plantId);
    console.log('Available plants:', samplePlants.map(p => ({ id: p.id, name: p.name })));
    
    // Find plant by ID
    const foundPlant = samplePlants.find(p => p.id === plantId);
    console.log('Found plant:', foundPlant);
    
    if (foundPlant) {
      setPlant(foundPlant);
    }
    setLoading(false);
  }, [plantId]);

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

  const handleBackClick = () => {
    setLocation('/plants');
  };

  const handleAddToCart = () => {
    if (plant) {
      console.log('Adding plant to cart:', plant.name, plant.id);
      addToCart(plant);
      onAddToCart(plant.id);
      // Show success message (you can add a toast notification here)
      console.log('Added to cart:', plant.name);
    } else {
      console.log('No plant found to add to cart');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.userName.trim() && newReview.comment.trim()) {
      const review: Review = {
        id: Date.now().toString(),
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        verified: false
      };
      
      setReviews(prev => [review, ...prev]);
      setNewReview({ userName: '', rating: 5, comment: '' });
      setShowReviewForm(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          cartItems={0}
          onCartClick={() => {}}
          onSearchChange={() => {}}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading plant details...</p>
            <p className="text-sm text-gray-500 mt-2">URL: {window.location.pathname}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          cartItems={0}
          onCartClick={() => {}}
          onSearchChange={() => {}}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Plant Not Found</h1>
            <p className="text-gray-600 mb-2">The plant you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-500 mb-6">URL: {window.location.pathname}</p>
            <Button onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={getTotalItems()}
        onCartClick={() => setLocation('/cart')}
        onSearchChange={() => {}}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBackClick}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plants
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Plant Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Gallery Placeholder */}
            <div className="grid grid-cols-4 gap-2">
              <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-md bg-gray-100">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Plant Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{plant.category}</Badge>
                {!plant.inStock && (
                  <Badge variant="secondary">Out of Stock</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{plant.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(plant.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {plant.rating} ({plant.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(plant.price)}
                </span>
                {plant.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(plant.originalPrice)}
                  </span>
                )}
                {plant.originalPrice && (
                  <Badge className="bg-red-500">
                    {Math.round((1 - plant.price / plant.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {plant.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {plant.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!plant.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isInCart(plant.id) ? 'Added to Cart' : 'Add to Cart'}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Wishlist
                </Button>
              </div>
            </div>

            {/* Plant Care Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Plant Care Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-sm">Light Requirements</p>
                      <p className="text-sm text-gray-600">{plant.lightRequirements}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Watering Schedule</p>
                      <p className="text-sm text-gray-600">{plant.wateringSchedule}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Soil Type</p>
                      <p className="text-sm text-gray-600">{plant.soilType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-sm">Size</p>
                      <p className="text-sm text-gray-600">{plant.size}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
              <p className="text-gray-700 leading-relaxed">{plant.careInstructions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(plant.rating)}
                </div>
                <span className="text-lg font-medium">{plant.rating}</span>
                <span className="text-gray-600">({reviews.length} reviews)</span>
              </div>
              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="userName">Your Name</Label>
                      <Input
                        id="userName"
                        value={newReview.userName}
                        onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {newReview.rating} star{newReview.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Share your experience with this plant..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Submit Review
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {review.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{review.userName}</p>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
