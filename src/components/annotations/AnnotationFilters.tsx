import React from 'react';
import { AnnotationType, AnnotationFilter } from '@/types/annotation';

interface AnnotationFiltersProps {
  activeFilter: AnnotationType | 'all';
  filters: AnnotationFilter[];
  onFilterChange: (type: AnnotationType | 'all') => void;
}

export const AnnotationFilters: React.FC<AnnotationFiltersProps> = ({
  activeFilter,
  filters,
  onFilterChange,
}) => {
  const activeFilterLabel = filters.find(f => f.type === activeFilter)?.label || 'All';
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Filter:</span>
      <select
        value={activeFilter}
        onChange={(e) => onFilterChange(e.target.value as AnnotationType | 'all')}
        className="text-sm border border-gray-300 rounded px-3 py-1 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {filters.map((filter) => (
          <option key={filter.type} value={filter.type}>
            {filter.icon} {filter.label} ({filter.count})
          </option>
        ))}
      </select>
    </div>
  );
};