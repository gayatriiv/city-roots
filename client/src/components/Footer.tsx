import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface FooterProps {
  onNewsletterSignup?: (email: string) => void;
  onNavigate?: (section: string) => void;
}

export default function Footer({ onNewsletterSignup, onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

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

  const handleNavigation = (section: string) => {
    console.log(`Navigate to: ${section}`); //todo: remove mock functionality
    onNavigate?.(section);
  };

  const footerSections = {
    shop: {
      title: "Shop",
      links: [
        { label: "Flowering Plants", href: "flowering-plants" },
        { label: "Decorative Plants", href: "decorative-plants" },
        { label: "Fruit Plants", href: "fruit-plants" },
        { label: "Gardening Tools", href: "tools" },
        { label: "Seeds & Seedlings", href: "seeds" },
        { label: "Gift Kits", href: "gifts" }
      ]
    },
    learn: {
      title: "Learn & Grow",
      links: [
        { label: "Beginner Guides", href: "guides/beginner" },
        { label: "Advanced Techniques", href: "guides/advanced" },
        { label: "Plant Care Tips", href: "guides/care" },
        { label: "Seasonal Gardening", href: "guides/seasonal" },
        { label: "Problem Solving", href: "guides/problems" },
        { label: "Video Tutorials", href: "guides/videos" }
      ]
    },
    support: {
      title: "Customer Support",
      links: [
        { label: "Contact Us", href: "contact" },
        { label: "Shipping Info", href: "shipping" },
        { label: "Returns & Exchanges", href: "returns" },
        { label: "Plant Care Support", href: "support" },
        { label: "FAQ", href: "faq" },
        { label: "Track Your Order", href: "tracking" }
      ]
    },
    company: {
      title: "About Earthly Gardens",
      links: [
        { label: "Our Story", href: "about" },
        { label: "Sustainability", href: "sustainability" },
        { label: "Expert Team", href: "team" },
        { label: "Careers", href: "careers" },
        { label: "Press", href: "press" },
        { label: "Partnerships", href: "partners" }
      ]
    }
  };

  return (
    <footer className="bg-muted/30 pt-16 pb-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-serif font-bold text-foreground">
                Earthly Gardens
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
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2" data-testid="newsletter-form">
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
                  data-testid="newsletter-submit"
                >
                  {isSubscribing ? 'Signing up...' : 'Subscribe'}
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3" data-testid="social-links">
              {[
                { icon: Facebook, label: "Facebook", href: "facebook" },
                { icon: Instagram, label: "Instagram", href: "instagram" },
                { icon: Twitter, label: "Twitter", href: "twitter" },
                { icon: Youtube, label: "YouTube", href: "youtube" }
              ].map(({ icon: Icon, label, href }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => handleNavigation(`social/${href}`)}
                  data-testid={`social-${href}`}
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
              <p className="text-sm text-muted-foreground">(555) 123-GROW</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Email us</p>
              <p className="text-sm text-muted-foreground">help@earthlygardens.com</p>
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
            <span>© 2024 Earthly Gardens. All rights reserved.</span>
            <button 
              onClick={() => handleNavigation('privacy')}
              className="hover:text-primary transition-colors"
              data-testid="privacy-link"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handleNavigation('terms')}
              className="hover:text-primary transition-colors"
              data-testid="terms-link"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => handleNavigation('cookies')}
              className="hover:text-primary transition-colors"
              data-testid="cookies-link"
            >
              Cookie Policy
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Leaf className="h-3 w-3 text-primary" />
            <span>Growing sustainably since 2020</span>
          </div>
        </div>
      </div>
    </footer>
  );
}