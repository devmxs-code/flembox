import React from 'react';
import { Star } from 'lucide-react';

const SIZE_CLASSES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const StarRating = React.memo(({ itemId, rating, onRate, size = 'md' }) => {
  const currentRating = rating || 0;
  const sizeClass = SIZE_CLASSES[size];

  const handleStarClick = (starValue) => {
    if (onRate) {
      onRate(itemId, starValue);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            handleStarClick(star);
          }}
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={`${sizeClass} transition-colors ${
              star <= currentRating
                ? 'fill-gray-700 dark:fill-gray-300 text-gray-700 dark:text-gray-300'
                : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'
            }`}
            fill={star <= currentRating ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
});

StarRating.displayName = 'StarRating';

