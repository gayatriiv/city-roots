import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ShoppingCart, Heart, Star, ArrowLeft } from "lucide-react";

interface GiftBundle {
  id: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

const bundles: GiftBundle[] = [
  {
    id: "gift-starter",
    name: "Gift Set",
    description: "Perfect starter kit for beginners",
    image: "/images/gift-set.jpeg",
    itemCount: 1,
    price: 3999,
    originalPrice: 4499,
    rating: 4.7,
    reviews: 102,
    inStock: true,
    tags: ["gift", "starter"],
  },
  {
    id: "herbs-collection",
    name: "Herbs Collection",
    description: "Fresh herbs for cooking and wellness",
    image: "/images/herb-kit.png",
    itemCount: 8,
    price: 1299,
    rating: 4.6,
    reviews: 58,
    inStock: true,
    tags: ["herbs", "kitchen"],
  },
  {
    id: "rose-collection",
    name: "Rose Collection",
    description: "Beautiful roses in various colors",
    image: "/images/rose-bush collection.jpeg",
    itemCount: 6,
    price: 2499,
    rating: 4.8,
    reviews: 74,
    inStock: true,
    tags: ["roses", "flowering"],
  },
  {
    id: "succulents",
    name: "Succulent Collection",
    description: "Low-maintenance succulents for any space",
    image: "/images/succulent-collection.png",
    itemCount: 12,
    price: 1899,
    rating: 4.5,
    reviews: 61,
    inStock: true,
    tags: ["succulents", "low maintenance"],
  },
  {
    id: "tools-kit",
    name: "Gardening Tools Set",
    description: "Professional quality tools for every gardener",
    image: "/images/premium-gardening tools.png",
    itemCount: 15,
    price: 4999,
    rating: 4.7,
    reviews: 83,
    inStock: true,
    tags: ["tools", "kit"],
  },
  {
    id: "mini-plants",
    name: "Mini Plants Set",
    description: "Charming mini plants for desks and shelves",
    image: "/images/mini plants.jpg",
    itemCount: 10,
    price: 1499,
    rating: 4.4,
    reviews: 47,
    inStock: true,
    tags: ["mini", "gift"],
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

export default function GiftDetailPage() {
  const [, params] = useRoute("/gift/:id");
  const { addToCart, isInCart, getTotalItems } = useCart();
  const [, setLocation] = useLocation();

  const bundle = bundles.find(b => b.id === params?.id);

  if (!bundle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-destructive">Gift bundle not found</p>
      </div>
    );
  }

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));

  // Simple in-page reviews (non-persistent)
  interface UserReview { name: string; rating: number; comment: string; date: string }
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState("");

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    const newReview: UserReview = {
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString(),
    };
    setUserReviews([newReview, ...userReviews]);
    setReviewName("");
    setReviewRating(5);
    setReviewComment("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={getTotalItems()} onCartClick={() => setLocation('/cart')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => window.history.length > 1 ? window.history.back() : setLocation('/gifting-sets')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover" />
            {bundle.originalPrice && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                {Math.round((1 - bundle.price / bundle.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-3">{bundle.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">{renderStars(bundle.rating)}</div>
              <span className="text-sm text-gray-500">({bundle.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">{formatPrice(bundle.price)}</span>
              {bundle.originalPrice && (
                <span className="text-lg text-gray-500 line-through">{formatPrice(bundle.originalPrice)}</span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{bundle.description}</p>

            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline">Items: {bundle.itemCount}</Badge>
                <Badge variant="outline">Category: Gifting Sets</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {bundle.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => addToCart({ id: bundle.id, name: bundle.name, price: bundle.price, image: bundle.image, category: "Gifting Sets" })}
                disabled={!bundle.inStock || isInCart(bundle.id)}
                variant={isInCart(bundle.id) ? "secondary" : "default"}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isInCart(bundle.id) ? "Added" : "Add to Cart"}
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">{renderStars(bundle.rating)}</div>
              <span className="text-sm text-gray-500">Average {bundle.rating.toFixed(1)} • {bundle.reviews + userReviews.length} total</span>
            </div>
            {userReviews.length === 0 && (
              <p className="text-sm text-gray-500">No reviews yet from this session. Be the first to write one!</p>
            )}
            <ul className="space-y-4 mt-4">
              {userReviews.map((r, idx) => (
                <li key={idx} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{r.name}</span>
                    <span className="text-xs text-gray-500">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{r.comment}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <Input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setReviewRating(i + 1)}
                      aria-label={`Rate ${i + 1} star`}
                    >
                      <Star className={`h-5 w-5 ${i < reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{reviewRating} / 5</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Review</label>
                <Textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={4} placeholder="Share your experience..." />
              </div>
              <Button type="submit">Submit Review</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


