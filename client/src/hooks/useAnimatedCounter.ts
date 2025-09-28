import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterProps {
  target: number;
  duration?: number;
  delay?: number;
  startOnMount?: boolean;
}

export const useAnimatedCounter = ({ 
  target, 
  duration = 2000, 
  delay = 0,
  startOnMount = true 
}: UseAnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Ensure target is a valid positive number
    const validTarget = Math.max(0, Math.floor(target));
    
    console.log('useAnimatedCounter - starting animation with target:', target, 'validTarget:', validTarget);
    
    setIsAnimating(true);
    setCount(0);
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return;

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutCubic * validTarget);
      
      setCount(currentCount);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCount(validTarget);
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (startOnMount && target > 0) {
      const timer = setTimeout(() => {
        startAnimation();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [target, duration, delay, startOnMount]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    count,
    isAnimating,
    startAnimation,
    reset: () => setCount(0)
  };
};