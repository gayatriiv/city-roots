import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, User, ArrowRight, BookOpen, Leaf } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGuides } from "@/lib/api";
import { getImageUrl } from "@/lib/api";

interface Guide {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  author: string;
  category: string;
  featured?: boolean;
}

interface GuidesSectionProps {
  onGuideClick?: (guideId: string) => void;
  onViewAllGuides?: () => void;
}

export default function GuidesSection({ onGuideClick, onViewAllGuides }: GuidesSectionProps) {
  const { data: allGuides = [], isLoading } = useQuery({
    queryKey: ['guides'],
    queryFn: () => fetchGuides(),
  });

  const guides = allGuides;

  const handleGuideClick = (guideId: string) => {
    console.log(`Open guide: ${guideId}`); //todo: remove mock functionality
    onGuideClick?.(guideId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <section className="py-16 bg-background" data-testid="guides-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Expert Guides
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from gardening experts with comprehensive guides for every skill level
          </p>
        </div>

        {/* Featured Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden animate-pulse">
                <div className="bg-muted h-48"></div>
                <div className="p-4 space-y-2">
                  <div className="bg-muted h-4 rounded w-1/4"></div>
                  <div className="bg-muted h-6 rounded w-3/4"></div>
                  <div className="bg-muted h-4 rounded w-full"></div>
                  <div className="bg-muted h-4 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            guides.filter(guide => guide.featured).map((guide) => (
              <Card
              key={guide.id}
              className="group hover-elevate cursor-pointer overflow-hidden"
              onClick={() => handleGuideClick(guide.id)}
              data-testid={`guide-card-${guide.id}`}
            >
              <div className="relative h-48">
                <img
                  src={getImageUrl(guide.image)}
                  alt={guide.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge
                  className={`absolute top-3 left-3 ${getDifficultyColor(guide.difficulty)}`}
                  data-testid={`difficulty-badge-${guide.id}`}
                >
                  {guide.difficulty}
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs" data-testid={`category-badge-${guide.id}`}>
                    {guide.category}
                  </Badge>
                  
                  <h3 className="font-semibold text-lg leading-tight text-card-foreground group-hover:text-primary transition-colors" data-testid={`guide-title-${guide.id}`}>
                    {guide.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`guide-description-${guide.id}`}>
                    {guide.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span data-testid={`guide-author-${guide.id}`}>{guide.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span data-testid={`guide-read-time-${guide.id}`}>{guide.readTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Other Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {guides.filter(guide => !guide.featured).map((guide) => (
            <Card
              key={guide.id}
              className="group hover-elevate cursor-pointer"
              onClick={() => handleGuideClick(guide.id)}
              data-testid={`guide-card-${guide.id}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={getImageUrl(guide.image)}
                    alt={guide.title}
                    className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Badge
                        className={`text-xs ${getDifficultyColor(guide.difficulty)}`}
                        data-testid={`difficulty-badge-${guide.id}`}
                      >
                        {guide.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs" data-testid={`category-badge-${guide.id}`}>
                        {guide.category}
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-card-foreground group-hover:text-primary transition-colors" data-testid={`guide-title-${guide.id}`}>
                      {guide.title}
                    </h4>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span data-testid={`guide-author-${guide.id}`}>{guide.author}</span>
                      <span data-testid={`guide-read-time-${guide.id}`}>{guide.readTime}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-accent/20 rounded-lg p-8">
          <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Ready to Start Your Garden Journey?
          </h3>
          <p className="text-muted-foreground mb-4">
            Access our complete library of expert guides and tutorials
          </p>
          <Button
            onClick={() => {
              console.log('View all guides clicked'); //todo: remove mock functionality
              onViewAllGuides?.();
            }}
            data-testid="view-all-guides"
          >
            Browse All Guides
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}