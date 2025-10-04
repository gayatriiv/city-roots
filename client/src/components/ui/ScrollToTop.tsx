import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScroll';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
}

export default function ScrollToTop({ threshold = 300, className = '' }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isScrolled = useScrollPosition(threshold);

  useEffect(() => {
    setIsVisible(isScrolled);
  }, [isScrolled]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={`fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${className}`}
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-4 w-4" />
    </Button>
  );
}
