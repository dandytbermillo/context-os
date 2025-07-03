import React from 'react';
import { AnnotationStats, SortOption } from '@/types/annotation';

interface AnnotationSummaryProps {
  stats: AnnotationStats;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const AnnotationSummary: React.FC<AnnotationSummaryProps> = ({
  stats,
  sortOption,
  onSortChange,
}) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'type', label: 'Type' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <div className="annotation-summary flex justify-between items-center p-5 bg-gray-50 rounded-lg mb-5 mx-5">
      <div className="summary-stats flex gap-8">
        <div className="stat-item text-center">
          <div className="stat-number text-2xl font-bold text-gray-800">
            {stats.total}
          </div>
          <div className="stat-label text-xs text-gray-500 uppercase tracking-wide">
            Total
          </div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-number text-2xl font-bold text-gray-800">
            {stats.comment}
          </div>
          <div className="stat-label text-xs text-gray-500 uppercase tracking-wide">
            Comments
          </div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-number text-2xl font-bold text-gray-800">
            {stats.highlight}
          </div>
          <div className="stat-label text-xs text-gray-500 uppercase tracking-wide">
            Highlights
          </div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-number text-2xl font-bold text-gray-800">
            {stats.question}
          </div>
          <div className="stat-label text-xs text-gray-500 uppercase tracking-wide">
            Questions
          </div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-number text-2xl font-bold text-gray-800">
            {stats.citation}
          </div>
          <div className="stat-label text-xs text-gray-500 uppercase tracking-wide">
            Citations
          </div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-number text-2xl font-bold text-gray-800">
            {stats.note}
          </div>
          <div className="stat-label text-xs text-gray-500 uppercase tracking-wide">
            Notes
          </div>
        </div>
      </div>
      
      <div className="summary-actions">
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="sort-dropdown px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Sort by: {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};