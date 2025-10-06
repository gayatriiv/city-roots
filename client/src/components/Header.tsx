import { ShoppingCart, Search, Menu, Leaf, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import AnimatedCounter from "@/components/AnimatedCounter";

interface HeaderProps {
  cartItems?: number;
  onCartClick?: () => void;
  onSearchChange?: (query: string) => void;
}

export default function Header({ cartItems = 0, onCartClick, onSearchChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
    console.log('Search query:', value); //todo: remove mock functionality
  };

  const handleCategoryClick = (category: string, item: string) => {
    const categoryMap: { [key: string]: string } = {
      'Plants': 'plants',
      'Tools': 'tools', 
      'Seeds': 'seeds',
      'Guides': 'guides',
      'Gifting Sets': 'gifting-sets'
    };
    
    const baseRoute = categoryMap[category];
    if (!baseRoute) return;
    
    // Create URL with category filter
    const filterParam = encodeURIComponent(item);
    setLocation(`/${baseRoute}?category=${filterParam}`);
  };

  const mainCategories = [
    {
      name: "Plants",
      items: ["Flowering Plants", "Decorative Plants", "Fruit Plants", "Indoor Plants", "Outdoor Plants"]
    },
    {
      name: "Tools",
      items: ["Hand Tools", "Power Tools", "Watering Equipment", "Pruning Tools", "Soil Tools"]
    },
    {
      name: "Seeds",
      items: []
    },
    {
      name: "Gifting Sets",
      items: []
    },
    {
      name: "Guides",
      items: []
    }
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/images/new-logo.png" alt="City Roots" className="h-10 sm:h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2" data-testid="desktop-nav">
            {mainCategories.map((category) => {
              const slug = category.name.toLowerCase().replace(/\s+/g, '-');
              const isActive = location === `/${slug}`;
              return (
              <DropdownMenu key={category.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`text-sm transition-colors px-3 py-2 ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    data-testid={`nav-${category.name.toLowerCase()}`}
                  >
                    {category.name}
                    {category.items.length > 0 && <ChevronDown className="ml-1 h-3 w-3" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {/* Add "All" category link */}
                  <DropdownMenuItem asChild>
                    <Link 
                      href={`/${slug}`} 
                      className="block w-full"
                      data-testid={`nav-all-${category.name.toLowerCase()}`}
                    >
                      All {category.name}
                    </Link>
                  </DropdownMenuItem>
                  {category.items.map((item) => (
                    <DropdownMenuItem
                      key={item}
                      onClick={() => handleCategoryClick(category.name, item)}
                      data-testid={`nav-item-${item.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              );
            })}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-3">
          {/* Search */}
            <div className="hidden sm:flex items-center relative ml-3 md:ml-4">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search plants, tools..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 w-64"
                data-testid="search-input"
              />
            {/* First purchase + dynamic sale hints */}
            <span className="ml-3 hidden lg:inline text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1 mr-2">
              New here? Get 10% OFF on your first order
            </span>
            <span className="hidden xl:inline text-xs text-white bg-amber-600 rounded px-2 py-1 animate-pulse">
              Autumn Day Sale
            </span>
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
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground animate-pulse"
                  data-testid="cart-badge"
                >
                  <AnimatedCounter 
                    target={cartItems > 99 ? 99 : cartItems} 
                    duration={1000}
                    delay={0}
                    suffix={cartItems > 99 ? "+" : ""}
                    className="text-xs"
                  />
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
            <nav className="space-y-3">
              {mainCategories.map((category) => {
                const slug = category.name.toLowerCase().replace(/\s+/g, '-');
                return (
                <div key={category.name} className="space-y-1">
                  <h4 className="font-medium text-sm text-foreground px-2 py-1" data-testid={`mobile-nav-${category.name.toLowerCase()}`}>
                    {category.name}
                  </h4>
                  <div className="space-y-1 pl-4">
                    <Link
                      href={`/${slug}`}
                      className="block w-full text-left py-2 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      All {category.name}
                    </Link>
                    {category.items.map((item) => (
                      <button
                        key={item}
                        className="block w-full text-left py-1 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        onClick={() => {
                          handleCategoryClick(category.name, item);
                          setIsMobileMenuOpen(false);
                        }}
                        data-testid={`mobile-nav-item-${item.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              );
              })}
              
              {/* Additional Mobile Links */}
              <div className="pt-4 border-t border-border">
                <Link
                  href="/about"
                  className="block w-full text-left py-2 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/track-order"
                  className="block w-full text-left py-2 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Track Order
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}