import React, { useState, useEffect } from 'react';

interface SimpleCounterProps {
  target: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const SimpleCounter: React.FC<SimpleCounterProps> = ({
  target,
  duration = 2000,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const validTarget = Math.max(0, Math.floor(Number(target) || 0));
    console.log('SimpleCounter - target:', target, 'validTarget:', validTarget);
    
    if (validTarget === 0) {
      setCount(0);
      return;
    }
    
    const timer = setTimeout(() => {
      let current = 0;
      const increment = validTarget / (duration / 16); // 60fps
      const interval = setInterval(() => {
        current += increment;
        if (current >= validTarget) {
          setCount(validTarget);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return (
    <span className={`inline-block transition-all duration-300 ${className}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default SimpleCounter;
