import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SimpleCounter from "@/components/SimpleCounter";

interface GiftBundle {
  id: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  price: string;
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
      price: "₹3,999",
    },
    {
      id: "herbs-collection",
      name: "Herbs Collection",
      description: "Fresh herbs for cooking and wellness",
      image: "/images/herb-kit.png",
      itemCount: 8,
      price: "₹1,299",
    },
    {
      id: "rose-collection",
      name: "Rose Collection",
      description: "Beautiful roses in various colors",
      image: "/images/rose-bush collection.jpeg",
      itemCount: 6,
      price: "₹2,499",
    },
    {
      id: "succulents",
      name: "Succulent Collection",
      description: "Low-maintenance succulents for any space",
      image: "/images/succulent-collection.png",
      itemCount: 12,
      price: "₹1,899",
    },
    {
      id: "tools-kit",
      name: "Gardening Tools Set",
      description: "Professional quality tools for every gardener",
      image: "/images/premium-gardening tools.png",
      itemCount: 15,
      price: "₹4,999",
    },
    {
      id: "mini-plants",
      name: "Mini Plants Set",
      description: "Charming mini plants for desks and shelves",
      image: "/images/mini plants.jpg",
      itemCount: 10,
      price: "₹1,499",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={getTotalItems()} />

      {/* Page header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Gifting Sets</h1>
          <p className="text-gray-600 mt-1">Curated gift bundles ideal for any gardener.</p>
        </div>
      </div>

      {/* Grid of gift bundles */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {giftBundles.map((bundle, index) => (
              <Card
                key={bundle.id}
                className="group hover:shadow-lg cursor-pointer overflow-hidden transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder-plant.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Item Count Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                        <SimpleCounter target={bundle.itemCount} duration={1500} delay={index * 150} /> items
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        {bundle.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {bundle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{bundle.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          addToCart({
                            id: bundle.id,
                            name: bundle.name,
                            price: parseInt(bundle.price.replace(/[^\d]/g, ""), 10),
                            image: bundle.image,
                            category: "Gifting Sets",
                            description: bundle.description,
                            rating: 4.7,
                            reviews: 100,
                            inStock: true,
                            tags: ["gift", "bundle"],
                          })
                        }
                        variant={isInCart(bundle.id) ? "secondary" : "default"}
                        disabled={isInCart(bundle.id)}
                      >
                        {isInCart(bundle.id) ? "Added" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


