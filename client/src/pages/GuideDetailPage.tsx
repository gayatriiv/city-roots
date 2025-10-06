import { useRoute, useLocation } from "wouter";
import Header from "@/components/Header";
import { guidesData } from "@/data/guidesData";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, User, ArrowLeft } from "lucide-react";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function GuideDetailPage() {
  const [, params] = useRoute('/guide/:id');
  const [, setLocation] = useLocation();
  const guide = guidesData.find(g => g.id === (params?.id || ''));

  if (!guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">Guide not found</p>
          <button className="text-sm underline" onClick={() => setLocation('/guides')}>Back to Guides</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={0} onSearchChange={() => {}} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setLocation('/guides')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Guides
        </button>

        <h1 className="text-3xl font-bold mb-2">{guide.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="inline-flex items-center"><Clock className="h-4 w-4 mr-1" />{guide.readTime}</span>
          <span className="inline-flex items-center"><User className="h-4 w-4 mr-1" />{guide.author}</span>
          <Badge variant="secondary">{guide.difficulty}</Badge>
        </div>

        <div className="aspect-video overflow-hidden rounded-lg mb-6">
          <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-neutral max-w-none whitespace-pre-wrap leading-relaxed">
          {guide.content}
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}


