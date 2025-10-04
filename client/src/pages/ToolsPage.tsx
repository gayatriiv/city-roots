import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, LayoutGrid, List, Star, ShoppingCart, Eye } from 'lucide-react';

import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart, Product } from '@/contexts/CartContext';
import { Tool, toolsData } from '@/data/toolsData';

// Helper function to get image URL
const getToolImageUrl = (imagePath: string) => {
  return imagePath;
};

export default function ToolsPage() {
  const [, setLocation] = useLocation();
  const { addToCart, isInCart, getTotalItems } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>('All Tools');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Handle URL category parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  // Mock fetching tools data
  const { data: tools, isLoading, error } = useQuery<Tool[]>({
    queryKey: ['tools'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      return toolsData;
    },
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    tools?.forEach(tool => uniqueCategories.add(tool.category));
    return ['All Tools', ...Array.from(uniqueCategories)].sort();
  }, [tools]);

  const filteredAndSortedTools = useMemo(() => {
    if (!tools) return [];

    let filtered = tools;

    // Filter by category
    if (selectedCategory !== 'All Tools') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort tools
    const sorted = [...filtered];
    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return sorted;
  }, [tools, selectedCategory, searchQuery, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleToolClick = (toolId: string) => {
    setLocation(`/tool/${toolId}`);
  };

  const handleAddToCart = (tool: Tool) => {
    console.log('Adding tool to cart:', tool.name, tool.id);
    addToCart(tool as Product);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Loading tools...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-destructive">Error loading tools: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tools</h1>
              <p className="text-gray-600 mt-1">
                Discover our collection of {filteredAndSortedTools.length} quality gardening tools
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Tools
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                  <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tools Display */}
          <div className="flex-1">
            {filteredAndSortedTools.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-muted-foreground">No tools found matching your criteria.</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'grid grid-cols-1 gap-6'
                }
              >
                {filteredAndSortedTools.map(tool => (
                  <Card
                    key={tool.id}
                    className={`group hover-elevate cursor-pointer overflow-hidden ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
                    data-testid={`tool-card-${tool.id}`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-full sm:w-1/3 h-48 sm:h-auto' : 'h-48 w-full'}`}>
                      <img
                        src={getToolImageUrl(tool.image)}
                        alt={tool.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          console.error(`Failed to load image: ${tool.image}`);
                          e.currentTarget.src = '/images/placeholder-tool.jpg';
                        }}
                      />
                      {/* Move the gradient overlay to only cover the bottom portion */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <CardContent className={`p-4 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      {/* Tool name */}
                      <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors mb-2">
                        {tool.name}
                      </h3>
                      
                      {/* Category badge - moved below title */}
                      <Badge className="w-fit mb-3 bg-muted hover:bg-muted text-muted-foreground">
                        {tool.category}
                      </Badge>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-3">
                        {tool.description}
                      </p>

                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(tool.price)}
                        </span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{tool.rating.toFixed(1)} ({tool.reviews})</span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-shrink-0' : 'mt-auto pt-3'}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs min-w-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToolClick(tool.id);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span className="truncate">View Details</span>
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-xs min-w-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(tool);
                          }}
                          disabled={!tool.inStock}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          <span className="truncate">{isInCart(tool.id) ? 'Added' : 'Add to Cart'}</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}