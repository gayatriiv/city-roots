import React from 'react';
import { Link } from 'wouter';
import { useScroll } from '@/hooks/useScroll';

interface SmoothScrollLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
  onClick?: () => void;
}

export default function SmoothScrollLink({ 
  to, 
  children, 
  className = '', 
  offset = 80,
  onClick 
}: SmoothScrollLinkProps) {
  const { scrollToElement } = useScroll();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If it's an internal link (starts with #)
    if (to.startsWith('#')) {
      const elementId = to.substring(1);
      scrollToElement(elementId, offset);
    } else {
      // For regular navigation, use wouter's Link
      // The smooth scroll will be handled by CSS
    }
    
    onClick?.();
  };

  if (to.startsWith('#')) {
    return (
      <a
        href={to}
        onClick={handleClick}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
