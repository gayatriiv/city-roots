import { Card } from "@/components/ui/card";
import SimpleCounter from "@/components/SimpleCounter";
import { useLocation } from "wouter";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
}

interface CategoriesSectionProps {
  onCategoryClick?: (categoryId: string) => void;
}

export default function CategoriesSection({ onCategoryClick }: CategoriesSectionProps) {
  const [, setLocation] = useLocation();
  // Main categories in 2x2 grid layout
  const categories: Category[] = [
    {
      id: "all-plants",
      name: "All Plants",
      description: "Complete collection of indoor and outdoor plants",
      image: "/images/all-plants.jpg",
      productCount: 26, // Total plants in our catalog
      featured: true
    },
    {
      id: "tools",
      name: "Tools",
      description: "Essential gardening tools and equipment",
      image: "/images/tools.jpg",
      productCount: 12, // Mock data for tools
      featured: true
    },
    {
      id: "seeds",
      name: "Seeds",
      description: "High-quality seeds and seedlings",
      image: "/images/seeds.jpg",
      productCount: 15, // Mock data for seeds
      featured: true
    },
    {
      id: "gift-sets",
      name: "Gifting Sets",
      description: "Perfect starter kits for gardening enthusiasts",
      image: "/images/gift-set.jpeg",
      productCount: 8, // Mock data for gift sets
      featured: true
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    switch (categoryId) {
      case 'all-plants':
        setLocation('/plants');
        break;
      case 'tools':
        setLocation('/tools');
        break;
      case 'seeds':
        setLocation('/seeds');
        break;
      case 'gift-sets':
        setLocation('/gifting-sets');
        break;
      default:
        onCategoryClick?.(categoryId);
    }
  };

  return (
    <section id="categories" className="py-16 bg-background scroll-snap-start" data-testid="categories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover everything you need for your garden, from beautiful plants to professional tools
          </p>
        </div>

        {/* Featured Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {categories.filter(cat => cat.featured).map((category, index) => (
            <Card
              key={category.id}
              className="group hover-elevate cursor-pointer overflow-hidden"
              onClick={() => handleCategoryClick(category.id)}
              data-testid={`category-card-${category.id}`}
            >
              <div className="relative h-48">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold mb-1" data-testid={`category-name-${category.id}`}>
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200" data-testid={`category-description-${category.id}`}>
                    {category.description}
                  </p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs" data-testid={`product-count-${category.id}`}>
                    <SimpleCounter 
                      target={category.productCount} 
                      duration={2000}
                      delay={index * 200}
                    /> items
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>


        {/* View All Button removed per request */}
      </div>
    </section>
  );
}