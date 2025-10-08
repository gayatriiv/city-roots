import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShoppingCart, Heart, Star, Plus, Sun, Droplets, Leaf } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface Seed {
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

// Static seed data (mirrors SeedsPage)
const seeds: Seed[] = [
  { id: "1", name: "Hibiscus Plant Seeds", price: 1299, image: '/images/hibiscus seeds.jpg', category: "Seeds", subcategory: "Outdoor Plants", description: "Beautiful tropical flowering plant with large, colorful blooms. Perfect for gardens and outdoor spaces.", careInstructions: "Plant in well-draining soil. Water regularly during blooming season. Provide full sun for best flowering.", lightRequirements: "Full sun (6+ hours)", wateringSchedule: "Twice a week", soilType: "Well-draining garden soil", size: "Medium (40-60cm)", rating: 4.7, reviews: 89, inStock: true, tags: ["Flowering", "Tropical", "Colorful Blooms", "Outdoor"] },
  { id: "2", name: "Rose Plant Seeds", price: 1599, image: '/images/rose seeds.jpg', category: "Seeds", subcategory: "Outdoor Plants", description: "Classic red roses that bloom beautifully in your garden. Perfect for gifting and romantic occasions.", careInstructions: "Plant in well-draining soil. Water deeply once a week. Provide 6+ hours of direct sunlight.", lightRequirements: "Full sun (6+ hours)", wateringSchedule: "Once a week", soilType: "Well-draining garden soil", size: "Large (40-50cm)", rating: 4.8, reviews: 127, inStock: true, tags: ["Flowering", "Garden", "Gift", "Classic"] },
  { id: "3", name: "Marigold Plant Seeds", price: 599, image: '/images/marigold seeds.jpg', category: "Seeds", subcategory: "Outdoor Plants", description: "Bright orange and yellow marigold flowers. Great for borders, pest control, and adding color to your garden.", careInstructions: "Plant in well-draining soil. Water regularly. Deadhead spent flowers to encourage more blooms.", lightRequirements: "Full sun to partial shade", wateringSchedule: "Twice a week", soilType: "Well-draining garden soil", size: "Small (20-30cm)", rating: 4.6, reviews: 95, inStock: true, tags: ["Flowering", "Pest Control", "Bright Colors", "Easy Care"] },
  { id: "4", name: "Bougainvillea Plant Seeds", price: 1899, image: '/images/bougainvillea seeds.jpg', category: "Seeds", subcategory: "Outdoor Plants", description: "Vibrant climbing plant with colorful bracts. Perfect for trellises, walls, and creating stunning garden displays.", careInstructions: "Plant in well-draining soil. Water regularly during growing season. Prune after flowering to maintain shape.", lightRequirements: "Full sun", wateringSchedule: "Twice a week", soilType: "Well-draining garden soil", size: "Large (60-100cm)", rating: 4.9, reviews: 156, inStock: true, tags: ["Climbing", "Colorful", "Vibrant", "Trellis"] },
  { id: "5", name: "Sunflower Plant Seeds", price: 799, image: '/images/sunflower seeds.jpg', category: "Seeds", subcategory: "Outdoor Plants", description: "Tall, cheerful sunflowers that follow the sun. Perfect for creating a dramatic garden focal point.", careInstructions: "Plant in full sun. Water deeply and regularly. Stake tall varieties to prevent toppling.", lightRequirements: "Full sun", wateringSchedule: "Daily during hot weather", soilType: "Well-draining garden soil", size: "Large (100-200cm)", rating: 4.5, reviews: 78, inStock: true, tags: ["Tall", "Cheerful", "Sun Following", "Dramatic"] },
  { id: "6", name: "Jasmine Plant Seeds", price: 1199, image: '/images/jasmine seeds.jpg', category: "Seeds", subcategory: "Outdoor Plants", description: "Fragrant white flowers that bloom at night. Perfect for trellises and garden borders.", careInstructions: "Plant in well-draining soil. Water regularly during blooming season. Prune after flowering.", lightRequirements: "Full sun to partial shade", wateringSchedule: "Twice a week", soilType: "Well-draining garden soil", size: "Medium (35-45cm)", rating: 4.8, reviews: 85, inStock: true, tags: ["Fragrant", "Night Blooming", "Climbing", "White Flowers"] },
  { id: "7", name: "Peace Lily Seeds", price: 899, image: '/images/peace lily seeds.jpg', category: "Seeds", subcategory: "Indoor Plants", description: "Elegant white blooms and glossy green leaves. Known for its air-purifying qualities and easy care.", careInstructions: "Keep soil moist but not soggy. Place in low to bright indirect light. Blooms year-round.", lightRequirements: "Low to bright indirect light", wateringSchedule: "Twice a week", soilType: "Rich, well-draining soil", size: "Small (20-30cm)", rating: 4.6, reviews: 89, inStock: true, tags: ["Air Purifying", "Indoor", "White Flowers", "Low Light"] },
  { id: "8", name: "Lotus Flower Seeds", price: 1499, image: '/images/lotus seeds.jpg', category: "Seeds", subcategory: "Aquatic Plants", description: "Sacred lotus seeds for water gardens. Produces stunning pink flowers that bloom in morning sunlight.", careInstructions: "Plant in pond soil under 6-24 inches of water. Provide full sun and warm temperatures.", lightRequirements: "Full sun (6+ hours)", wateringSchedule: "Maintain water level", soilType: "Aquatic soil or heavy clay", size: "Large (spreads 3-6 feet)", rating: 4.9, reviews: 67, inStock: true, tags: ["Aquatic", "Sacred", "Pink Flowers", "Water Garden"] },
  { id: "9", name: "Lavender Seeds", price: 899, image: '/images/lavender seeds.jpg', category: "Seeds", subcategory: "Herb Plants", description: "Fragrant lavender seeds for your herb garden. Perfect for borders, aromatherapy, and attracting pollinators.", careInstructions: "Plant in well-draining soil. Water sparingly once established. Trim after flowering.", lightRequirements: "Full sun", wateringSchedule: "Once per week", soilType: "Sandy, well-draining soil", size: "Medium (30-40cm)", rating: 4.7, reviews: 93, inStock: true, tags: ["Fragrant", "Herb", "Drought Tolerant", "Pollinator Friendly"] }
];

const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function SeedDetailPage() {
  const [, params] = useRoute('/seed/:id');
  const [, setLocation] = useLocation();
  const { addToCart, isInCart, getTotalItems } = useCart();
  const { requireAuth } = useAuthGuard();
  const [seed, setSeed] = useState<Seed | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<{ id: string; userName: string; rating: number; comment: string; date: string }[]>([]);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });

  useEffect(() => {
    const s = seeds.find(x => x.id === params?.id);
    setSeed(s || null);
  }, [params?.id]);

  if (!seed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">Seed not found</p>
          <Button onClick={() => setLocation('/seeds')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Seeds
          </Button>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    requireAuth(() => {
      addToCart({ id: seed.id, name: seed.name, price: seed.price, image: seed.image, category: seed.category });
    });
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) return;
    setReviews(prev => [{ id: Date.now().toString(), userName: newReview.userName, rating: newReview.rating, comment: newReview.comment, date: new Date().toISOString().split('T')[0] }, ...prev]);
    setNewReview({ userName: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={getTotalItems()} onCartClick={() => setLocation('/cart')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => setLocation('/seeds')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Seeds
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img src={seed.image} alt={seed.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[seed.image, seed.image, seed.image, seed.image].map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-md bg-gray-100">
                  <img src={img} alt={`${seed.name}-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{seed.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-4">{seed.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`h-4 w-4 ${i <= Math.floor(seed.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{seed.rating} ({seed.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">{formatPrice(seed.price)}</span>
                {seed.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">{formatPrice(seed.originalPrice)}</span>
                )}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">{seed.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {seed.tags.map(tag => (<Badge key={tag} variant="secondary">{tag}</Badge>))}
              </div>
              <div className="flex gap-4 mb-8">
                <Button size="lg" className="flex-1" onClick={handleAdd} disabled={!seed.inStock}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isInCart(seed.id) ? 'Added to Cart' : 'Add to Cart'}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5 mr-2" />
                  Wishlist
                </Button>
              </div>
            </div>

            {/* Care Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Growing Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-sm">Light Requirements</p>
                      <p className="text-sm text-gray-600">{seed.lightRequirements}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Watering Schedule</p>
                      <p className="text-sm text-gray-600">{seed.wateringSchedule}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Soil Type</p>
                      <p className="text-sm text-gray-600">{seed.soilType}</p>
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
              <p className="text-gray-700 leading-relaxed">{seed.careInstructions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Customer Reviews</h3>
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
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <Label htmlFor="rname">Your Name</Label>
                    <Input id="rname" value={newReview.userName} onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))} required />
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setNewReview(prev => ({ ...prev, rating: n }))}>
                          <Star className={`h-5 w-5 ${n <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{newReview.rating} / 5</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rcomment">Your Review</Label>
                    <Textarea id="rcomment" rows={4} value={newReview.comment} onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))} required />
                  </div>
                  <Button type="submit">Submit Review</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {reviews.length === 0 ? (
            <p className="text-muted-foreground">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <Card key={r.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{r.userName}</span>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} className={`h-3 w-3 ${n <= r.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-sm">{r.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


