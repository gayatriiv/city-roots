import { ShoppingCart, Search, Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface HeaderProps {
  cartItems?: number;
  onCartClick?: () => void;
  onSearchChange?: (query: string) => void;
}

export default function Header({ cartItems = 0, onCartClick, onSearchChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
    console.log('Search query:', value); //todo: remove mock functionality
  };

  const categories = [
    "Flowering Plants",
    "Decorative Plants", 
    "Fruit Plants",
    "Gardening Tools",
    "Seeds",
    "Gift Kits",
    "Guides"
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" data-testid="logo-icon" />
            <h1 className="text-xl font-serif font-bold text-foreground" data-testid="logo-text">
              Earthly Gardens
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" data-testid="desktop-nav">
            {categories.map((category) => (
              <button
                key={category}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md"
                onClick={() => console.log(`Navigate to ${category}`)} //todo: remove mock functionality
                data-testid={`nav-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden sm:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plants, tools..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 w-64"
                data-testid="search-input"
              />
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                console.log('Cart clicked'); //todo: remove mock functionality
                onCartClick?.();
              }}
              data-testid="cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground"
                  data-testid="cart-badge"
                >
                  {cartItems > 99 ? "99+" : cartItems}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4" data-testid="mobile-menu">
            {/* Mobile Search */}
            <div className="sm:hidden mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plants, tools..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 w-full"
                  data-testid="mobile-search-input"
                />
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="block w-full text-left py-2 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => {
                    console.log(`Navigate to ${category}`); //todo: remove mock functionality
                    setIsMobileMenuOpen(false);
                  }}
                  data-testid={`mobile-nav-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}