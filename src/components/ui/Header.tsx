import React from 'react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

interface HeaderProps {
  title: string;
  className?: string;
  onExport?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  className,
  onExport,
  onShare,
  onSave,
  children,
}) => {
  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 h-15 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shadow-sm',
      className
    )}>
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {children}
        {onExport && (
          <Button variant="default" onClick={onExport}>
            Export
          </Button>
        )}
        {onShare && (
          <Button variant="default" onClick={onShare}>
            Share
          </Button>
        )}
        {onSave && (
          <Button variant="primary" onClick={onSave}>
            Save Document
          </Button>
        )}
      </div>
    </header>
  );
};