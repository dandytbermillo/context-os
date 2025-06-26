import React from 'react';
import { cn } from '@/utils/cn';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md';
  className?: string;
  onRemove?: () => void;
}

export const Tag: React.FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  onRemove,
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-blue-100 text-blue-800',
  };
  
  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  
  return (
    <span className={cn(baseClasses, variants[variant], sizes[size], className)}>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1.5 -mr-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};