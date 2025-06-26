import React, { useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { PanelState } from '@/types';

interface PanelProps {
  children: React.ReactNode;
  isVisible: boolean;
  width: number;
  position: 'left' | 'right';
  className?: string;
  onResize?: (width: number) => void;
  onClose?: () => void;
  minWidth?: number;
  maxWidth?: number;
  title?: string;
  showCloseButton?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  isVisible,
  width,
  position,
  className,
  onResize,
  onClose,
  minWidth = 250,
  maxWidth = 600,
  title,
  showCloseButton = true,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !onResize) return;

      const deltaX = position === 'left' ? e.clientX - startX.current : startX.current - e.clientX;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth.current + deltaX));
      
      onResize(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.classList.remove('cursor-col-resize', 'select-none');
    };

    if (isResizing.current) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize, position, minWidth, maxWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onResize) return;
    
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    document.body.classList.add('cursor-col-resize', 'select-none');
    e.preventDefault();
  };

  const transformClass = isVisible 
    ? 'translate-x-0' 
    : position === 'left' 
      ? '-translate-x-full' 
      : 'translate-x-full';

  return (
    <div
      ref={panelRef}
      className={cn(
        'absolute top-0 bottom-0 bg-white border-gray-200 transition-transform duration-300 ease-in-out z-10',
        position === 'left' ? 'left-0 border-r' : 'right-0 border-l',
        transformClass,
        className
      )}
      style={{ width }}
    >
      {title && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {onResize && (
        <div
          ref={resizeHandleRef}
          className={cn(
            'resize-handle',
            position === 'left' ? 'right-0' : 'left-0'
          )}
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
};