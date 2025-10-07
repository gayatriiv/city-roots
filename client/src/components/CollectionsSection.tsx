import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import SimpleCounter from "@/components/SimpleCounter";
import { useLocation } from "wouter";

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  price?: string;
  featured: boolean;
}

interface CollectionsSectionProps {
  onCollectionClick?: (collectionId: string) => void;
}

export default function CollectionsSection({ onCollectionClick }: CollectionsSectionProps) {
  const [, setLocation] = useLocation();
  // Collections with proper image paths
  const collections: Collection[] = [
    {
      id: 'herbs-collection',
      name: 'Herbs Collection',
      description: 'Fresh herbs for cooking and wellness',
      image: '/images/herb-kit.png',
      itemCount: 8,
      price: '₹1,299',
      featured: true
    },
    {
      id: 'rose-collection',
      name: 'Rose Collection',
      description: 'Beautiful roses in various colors',
      image: '/images/rose-bush collection.jpeg',
      itemCount: 6,
      price: '₹2,499',
      featured: true
    },
    {
      id: 'gift-set',
      name: 'Gift Set',
      description: 'Perfect starter kit for beginners',
      image: '/images/gift-set.jpeg',
      itemCount: 1,
      price: '₹3,999',
      featured: true
    },
    {
      id: 'succulent-collection',
      name: 'Succulent Collection',
      description: 'Low-maintenance succulents for any space',
      image: '/images/succulent-collection.png',
      itemCount: 12,
      price: '₹1,899',
      featured: true
    },
    {
      id: 'gardening-tools',
      name: 'Gardening Tools Set',
      description: 'Professional quality tools for every gardener',
      image: '/images/premium-gardening tools.png',
      itemCount: 15,
      price: '₹4,999',
      featured: true
    }
  ];

  const handleCollectionClick = (collectionId: string) => {
    if (collectionId === 'gift-set') {
      setLocation('/gifting-sets');
      return;
    }
    onCollectionClick?.(collectionId);
  };

  return (
    <section id="collections" className="py-16 bg-background scroll-snap-start" data-testid="collections-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Featured Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Curated collections of plants, tools, and accessories for every gardening need
          </p>
          {/* Offer badges (dynamic subset) */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge className="bg-emerald-600 text-white">New users: 10% off first purchase</Badge>
            <Badge className="bg-amber-600 text-white animate-pulse">Autumn Day Sale</Badge>
            <Badge variant="outline">Free mini plant/seed pack on ₹999+</Badge>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {collections.map((collection, index) => (
            <Card
              key={collection.id}
              className="group hover:shadow-lg cursor-pointer overflow-hidden transition-all duration-300"
              onClick={() => handleCollectionClick(collection.id)}
              data-testid={`collection-card-${collection.id}`}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    onError={(e) => {
                      console.error(`Failed to load image: ${collection.image}`);
                      e.currentTarget.src = '/images/placeholder-plant.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Item Count Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                      <SimpleCounter 
                        target={collection.itemCount} 
                        duration={2000}
                        delay={index * 200}
                      /> items
                    </span>
                  </div>

                  {/* Price Badge */}
                  {collection.price && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        {collection.price}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {collection.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Collection
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Collections Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setLocation('/plants')}
            data-testid="view-all-collections"
          >
            View All Collections
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
