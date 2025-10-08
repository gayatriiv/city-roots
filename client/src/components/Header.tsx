import { ShoppingCart, Search, Menu, Leaf, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import LoginModal from "@/components/auth/LoginModal";

interface HeaderProps {
  cartItems?: number;
  onCartClick?: () => void;
  onSearchChange?: (query: string) => void;
}

export default function Header({ cartItems = 0, onCartClick, onSearchChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, signOutUser } = useAuth();
  const { requireAuth, showLoginModal, setShowLoginModal, handleLoginSuccess } = useAuthGuard();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleCategoryClick = (category: string, item: string) => {
    const categoryMap: { [key: string]: string } = {
      'Plants': 'plants',
      'Tools': 'tools', 
      'Seeds': 'seeds',
      'Guides': 'guides',
      'Collections': 'collections'
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
      name: "Collections",
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
        <div className="flex items-center h-16">
          {/* Logo and Site Name */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/images/city-roots logo.png" 
              alt="City Roots" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-semibold text-primary">
              City Roots
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-2" data-testid="desktop-nav">
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
          <div className="flex items-center space-x-3 flex-shrink-0">
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
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                onCartClick?.();
                setLocation('/cart');
              }}
              data-testid="cart-button"
            >
              <ShoppingCart className="h-6 w-6" />
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

            {/* User Profile */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.displayName || user.email}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation('/cart')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    My Cart
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/track-order')}>
                    Track Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOutUser}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowLoginModal(true)}
                className="text-sm"
              >
                Sign In
              </Button>
            )}

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
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => handleLoginSuccess(() => {
          console.log('User logged in successfully from header');
        })}
      />
    </header>
  );
}