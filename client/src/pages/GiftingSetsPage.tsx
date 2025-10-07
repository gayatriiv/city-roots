import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Grid, List, ShoppingCart, Eye, Heart, Star } from "lucide-react";
import { useMemo, useState } from "react";
import SimpleCounter from "@/components/SimpleCounter";

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

export default function GiftingSetsPage() {
  const { getTotalItems, addToCart, isInCart } = useCart();

  const giftBundles: GiftBundle[] = [
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

  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedBundle, setSelectedBundle] = useState<GiftBundle | null>(null);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
    { value: "rating", label: "Customer Rating" }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const filteredAndSorted = useMemo(() => {
    let items = giftBundles;
    if (searchQuery) {
      items = items.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    switch (sortBy) {
      case "price-low":
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case "name":
        items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        items = [...items].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return items;
  }, [giftBundles, searchQuery, sortBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={getTotalItems()} />

      {/* Page header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gifting Sets</h1>
              <p className="text-gray-600 mt-1">Curated gift bundles ideal for any gardener.</p>
            </div>
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

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search gifts by name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-60">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}`}>
            {filteredAndSorted.map((bundle, index) => (
              <Card
                key={bundle.id}
                className="group hover:shadow-lg cursor-pointer overflow-hidden transition-all duration-300"
              >
                <CardContent className="p-0">
                  {viewMode === "grid" ? (
                  <div>
                    <div className="relative h-48">
                      <img
                        src={bundle.image}
                        alt={bundle.name}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder-plant.jpg";
                        }}
                      />
                      {bundle.originalPrice && (
                        <Badge className="absolute top-3 left-3 bg-red-500">
                          {Math.round((1 - bundle.price / bundle.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                          {bundle.name}
                        </h3>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{bundle.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">{renderStars(bundle.rating)}</div>
                        <span className="text-sm text-gray-500">({bundle.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">{formatPrice(bundle.price)}</span>
                          {typeof bundle.originalPrice === 'number' && (
                            <span className="text-sm text-gray-500 line-through">{formatPrice(bundle.originalPrice)}</span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">Gifting Sets</Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-xs min-w-0" onClick={() => window.location.href = `/gift/${bundle.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          <span className="truncate">View Details</span>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs min-w-0"
                          onClick={() =>
                            addToCart({
                              id: bundle.id,
                              name: bundle.name,
                              price: bundle.price,
                              image: bundle.image,
                              category: "Gifting Sets",
                            })
                          }
                          disabled={!bundle.inStock}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          <span className="truncate">{isInCart(bundle.id) ? 'Added' : 'Add to Cart'}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  ) : (
                  <div className="flex">
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-32 h-32 object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder-plant.jpg";
                      }}
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg text-foreground">{bundle.name}</h3>
                        <Badge variant="outline" className="text-xs">Gifting Sets</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{bundle.description}</p>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">{renderStars(bundle.rating)}</div>
                          <span className="text-sm text-gray-500">({bundle.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">{formatPrice(bundle.price)}</span>
                          {typeof bundle.originalPrice === 'number' && (
                            <span className="text-sm text-gray-500 line-through">{formatPrice(bundle.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.location.href = `/gift/${bundle.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" onClick={() => addToCart({ id: bundle.id, name: bundle.name, price: bundle.price, image: bundle.image, category: "Gifting Sets" })}>
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
        </div>
      </section>

      {/* Details Modal */}
      {selectedBundle && (
        <Dialog open={!!selectedBundle} onOpenChange={() => setSelectedBundle(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedBundle.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <img src={selectedBundle.image} alt={selectedBundle.name} className="w-full h-full object-cover" />
                {selectedBundle.originalPrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500">
                    {Math.round((1 - selectedBundle.price / selectedBundle.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">{formatPrice(selectedBundle.price)}</span>
                  {selectedBundle.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">{formatPrice(selectedBundle.originalPrice)}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">{renderStars(selectedBundle.rating)}</div>
                  <span className="text-sm text-gray-500">({selectedBundle.reviews} reviews)</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Description</h4>
                <p className="text-gray-600">{selectedBundle.description}</p>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1"
                  onClick={() => {
                    addToCart({ id: selectedBundle.id, name: selectedBundle.name, price: selectedBundle.price, image: selectedBundle.image, category: "Gifting Sets" });
                    setSelectedBundle(null);
                  }}
                  disabled={!selectedBundle.inStock || isInCart(selectedBundle.id)}
                  variant={isInCart(selectedBundle.id) ? "secondary" : "default"}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInCart(selectedBundle.id) ? "Added" : "Add to Cart"}
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


