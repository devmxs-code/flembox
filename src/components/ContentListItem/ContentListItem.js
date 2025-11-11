import React from 'react';
import { Heart, Bookmark, Star, Film, Tv } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../constants/api';
import { formatDuration, formatYear, getGenreNames, getContentTitle, getContentReleaseDate } from '../../utils/formatters';

export const ContentListItem = React.memo(({ 
  item, 
  genres, 
  isFavorite, 
  isInWatchlist, 
  onFavoriteToggle, 
  onWatchlistToggle, 
  onDetailsClick 
}) => {
  const title = getContentTitle(item);
  const releaseDate = getContentReleaseDate(item);
  const genreNames = getGenreNames(item.genre_ids, genres);
  const Icon = item.type === 'movie' ? Film : Tv;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex border border-gray-200 dark:border-gray-700 cursor-pointer"
      onClick={() => onDetailsClick(item)}
    >
      <div className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 flex-shrink-0 relative">
        {item.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${item.poster_path}`}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder1.jpg';
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-70" />
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-base sm:text-lg dark:text-white line-clamp-2 flex-1">{title}</h3>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWatchlistToggle(item.id);
              }}
              className={`p-1 rounded-full transition-colors ${
                isInWatchlist
                  ? 'text-gray-800 dark:text-gray-200'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Bookmark className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(item.id);
              }}
              className={`p-1 rounded-full transition-colors ${
                isFavorite
                  ? 'text-gray-800 dark:text-gray-200'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          <span>{formatYear(releaseDate)}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-gray-600 dark:fill-gray-400 text-gray-600 dark:text-gray-400" />
            <span>{item.vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{formatDuration(item)}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-2 line-clamp-2">{item.overview}</p>
        {genreNames && (
          <div className="mt-auto pt-2">
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{genreNames}</span>
          </div>
        )}
      </div>
    </div>
  );
});

ContentListItem.displayName = 'ContentListItem';

