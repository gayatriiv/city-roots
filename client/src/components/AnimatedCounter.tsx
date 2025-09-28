import React from 'react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  startOnMount?: boolean;
  onComplete?: () => void;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  duration = 2000,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  startOnMount = true,
  onComplete
}) => {
  // Validate and ensure target is a valid positive number
  const validTarget = Math.max(0, Math.floor(Number(target) || 0));
  
  // Debug logging
  console.log('AnimatedCounter - target:', target, 'validTarget:', validTarget);
  
  const { count, isAnimating } = useAnimatedCounter({
    target: validTarget,
    duration,
    delay,
    startOnMount
  });

  React.useEffect(() => {
    if (!isAnimating && count === validTarget && onComplete) {
      onComplete();
    }
  }, [isAnimating, count, validTarget, onComplete]);

  return (
    <span className={`inline-block transition-all duration-300 ${className}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
