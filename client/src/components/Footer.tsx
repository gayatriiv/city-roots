import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useLocation } from "wouter";
import { useScroll } from "@/hooks/useScroll";

interface FooterProps {
  onNewsletterSignup?: (email: string) => void;
  onNavigate?: (section: string) => void;
}

export default function Footer({ onNewsletterSignup, onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { scrollToTop } = useScroll();
  const [, setLocation] = useLocation();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    console.log(`Newsletter signup: ${email}`); //todo: remove mock functionality
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribing(false);
      setEmail("");
      onNewsletterSignup?.(email);
    }, 1000);
  };

  const handleNavigation = (path: string) => {
    // Only navigate to real, existing routes in the app
    setLocation(path);
    onNavigate?.(path);
  };

  const footerSections = {
    shop: {
      title: "Shop",
      links: [
        { label: "Plants", href: "/plants" },
        { label: "Gardening Tools", href: "/tools" },
        { label: "Seeds", href: "/seeds" },
        { label: "Gifting Sets", href: "/gifting-sets" }
      ]
    },
    learn: {
      title: "Learn & Grow",
      links: [
        { label: "Guides", href: "/guides" }
      ]
    },
    support: {
      title: "Customer Support",
      links: [
        { label: "Track Order", href: "/track-order" }
      ]
    },
    company: {
      title: "About City Roots",
      links: [
        { label: "Our Story", href: "/about" }
      ]
    }
  } as const;

  return (
    <footer className="bg-muted/30 pt-16 pb-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8 mb-8">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-serif font-bold text-foreground">
                City Roots
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted partner in creating beautiful, sustainable gardens. 
              Expert advice, premium plants, and everything you need to grow.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Stay in the Loop</h4>
              <p className="text-xs text-muted-foreground">
                Get gardening tips, exclusive offers, and seasonal guides
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2" data-testid="newsletter-form">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                  data-testid="newsletter-input"
                />
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={isSubscribing}
                  className="whitespace-nowrap"
                  data-testid="newsletter-submit"
                >
                  {isSubscribing ? 'Signing up...' : 'Subscribe'}
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3" data-testid="social-links">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Youtube, label: "YouTube" }
              ].map(({ icon: Icon, label }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="space-y-3">
              <h4 className="font-semibold text-foreground" data-testid={`footer-section-${key}`}>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavigation(link.href)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      data-testid={`footer-link-${link.href}`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-6" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6" data-testid="contact-info">
          <div className="flex items-center space-x-3">
            <Phone className="h-4 w-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Call us</p>
              <p className="text-sm text-muted-foreground">+91 12345XXXX</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Email us</p>
              <p className="text-sm text-muted-foreground">help@cityroots.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Visit us</p>
              <p className="text-sm text-muted-foreground">Garden District, Green Valley</p>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0" data-testid="footer-bottom">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 City Roots. All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="text-xs"
            >
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}