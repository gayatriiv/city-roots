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

interface HeaderProps {
  cartItems?: number;
  onCartClick?: () => void;
  onSearchChange?: (query: string) => void;
}

export default function Header({ cartItems = 0, onCartClick, onSearchChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
    console.log('Search query:', value); //todo: remove mock functionality
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
      items: ["Vegetable Seeds", "Flower Seeds", "Herb Seeds", "Fruit Seeds", "Starter Kits"]
    },
    {
      name: "Guides",
      items: ["Beginner Guides", "Advanced Techniques", "Plant Care", "Seasonal Tips", "Problem Solving"]
    }
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" data-testid="logo-icon" />
            <h1 className="text-xl font-serif font-bold text-foreground" data-testid="logo-text">
              City Roots
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2" data-testid="desktop-nav">
            {mainCategories.map((category) => (
              <DropdownMenu key={category.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={location === "/plants" && category.name === "Plants" ? "default" : "ghost"}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                    data-testid={`nav-${category.name.toLowerCase()}`}
                  >
                    {category.name}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {category.name === "Plants" && (
                    <DropdownMenuItem asChild>
                      <Link href="/plants" className="block w-full">
                        All Plants
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {category.items.map((item) => (
                    <DropdownMenuItem
                      key={item}
                      onClick={() => console.log(`Navigate to ${item}`)} //todo: remove mock functionality
                      data-testid={`nav-item-${item.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
            <nav className="space-y-3">
              {mainCategories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <h4 className="font-medium text-sm text-foreground px-2 py-1" data-testid={`mobile-nav-${category.name.toLowerCase()}`}>
                    {category.name}
                  </h4>
                  <div className="space-y-1 pl-4">
                    {category.name === "Plants" && (
                      <Link
                        href="/plants"
                        className="block w-full text-left py-1 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        All Plants
                      </Link>
                    )}
                    {category.items.map((item) => (
                      <button
                        key={item}
                        className="block w-full text-left py-1 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        onClick={() => {
                          console.log(`Navigate to ${item}`); //todo: remove mock functionality
                          setIsMobileMenuOpen(false);
                        }}
                        data-testid={`mobile-nav-item-${item.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}