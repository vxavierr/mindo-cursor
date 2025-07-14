import React from 'react';
import { cn } from '@/lib/utils';

interface BackdropCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

/**
 * Reusable backdrop card component with consistent styling
 * Consolidates the repeated backdrop-blur patterns across the app
 */
const BackdropCard: React.FC<BackdropCardProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hover = false,
  onClick
}) => {
  const baseClasses = 'backdrop-blur-xl border transition-all duration-300';
  
  const variants = {
    default: 'bg-black/40 border-white/10',
    glass: 'bg-white/5 border-white/20',
    solid: 'bg-black/60 border-white/30',
    transparent: 'bg-transparent border-white/5'
  };
  
  const sizes = {
    sm: 'rounded-xl p-3',
    md: 'rounded-2xl p-4',
    lg: 'rounded-2xl p-6'
  };
  
  const hoverClasses = hover ? 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        hoverClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default BackdropCard;