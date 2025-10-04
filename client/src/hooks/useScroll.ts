import React, { useEffect, useCallback, useState } from 'react';

export const useScroll = () => {
  // Smooth scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Smooth scroll to element by ID
  const scrollToElement = useCallback((elementId: string, offset: number = 80) => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Smooth scroll to element by ref
  const scrollToRef = useCallback((ref: React.RefObject<HTMLElement>, offset: number = 80) => {
    if (ref.current) {
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  // Scroll to specific position
  const scrollToPosition = useCallback((position: number) => {
    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  }, []);

  return {
    scrollToTop,
    scrollToElement,
    scrollToRef,
    scrollToPosition
  };
};

// Hook for scroll position detection
export const useScrollPosition = (threshold: number = 100) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
};

// Hook for scroll direction detection
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return scrollDirection;
};
