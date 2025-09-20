import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import floweringPlantsImage from "@assets/generated_images/Flowering_plants_collection_5d058eb7.png";
import gardeningToolsImage from "@assets/generated_images/Gardening_tools_collection_9c82fa3c.png";
import seedsImage from "@assets/generated_images/Seeds_and_seedlings_9e473d23.png";

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
  //todo: remove mock functionality
  const categories: Category[] = [
    {
      id: 'flowering-plants',
      name: 'Flowering Plants',
      description: 'Beautiful blooms for every season',
      image: floweringPlantsImage,
      productCount: 156,
      featured: true
    },
    {
      id: 'gardening-tools',
      name: 'Gardening Tools',
      description: 'Professional quality tools for every gardener',
      image: gardeningToolsImage,
      productCount: 89,
      featured: true
    },
    {
      id: 'seeds-seedlings',
      name: 'Seeds & Seedlings',
      description: 'Start your garden from the beginning',
      image: seedsImage,
      productCount: 234,
      featured: true
    },
    {
      id: 'decorative-plants',
      name: 'Decorative Plants',
      description: 'Indoor and outdoor decorative plants',
      image: floweringPlantsImage, // Reusing for demo
      productCount: 92,
      featured: false
    },
    {
      id: 'fruit-plants',
      name: 'Fruit Plants',
      description: 'Grow your own fresh fruits',
      image: seedsImage, // Reusing for demo
      productCount: 67,
      featured: false
    },
    {
      id: 'gift-kits',
      name: 'Gift Kits',
      description: 'Perfect starter kits for gardening enthusiasts',
      image: gardeningToolsImage, // Reusing for demo
      productCount: 45,
      featured: false
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    console.log(`Navigate to category: ${categoryId}`); //todo: remove mock functionality
    onCategoryClick?.(categoryId);
  };

  return (
    <section className="py-16 bg-background" data-testid="categories-section">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {categories.filter(cat => cat.featured).map((category) => (
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
                    {category.productCount} items
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Other Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.filter(cat => !cat.featured).map((category) => (
            <Card
              key={category.id}
              className="group hover-elevate cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
              data-testid={`category-card-${category.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-semibold text-card-foreground" data-testid={`category-name-${category.id}`}>
                        {category.name}
                      </h4>
                      <p className="text-xs text-muted-foreground" data-testid={`product-count-${category.id}`}>
                        {category.productCount} items
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              console.log('View all categories clicked'); //todo: remove mock functionality
              onCategoryClick?.('all');
            }}
            data-testid="view-all-categories"
          >
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}