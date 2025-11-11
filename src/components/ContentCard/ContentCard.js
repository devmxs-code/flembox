import React from 'react';
import { Heart, Bookmark, Play, Film, Tv, Calendar, Clock } from 'lucide-react';
import { StarRating } from '../StarRating/StarRating';
import { IMAGE_BASE_URL } from '../../constants/api';
import { formatDuration, formatYear, getGenreNames, getContentTitle, getContentReleaseDate } from '../../utils/formatters';

export const ContentCard = React.memo(({ 
  item, 
  genres, 
  rating, 
  isFavorite, 
  isInWatchlist, 
  onFavoriteToggle, 
  onWatchlistToggle, 
  onRate, 
  onDetailsClick 
}) => {
  const title = getContentTitle(item);
  const releaseDate = getContentReleaseDate(item);
  const genreNames = getGenreNames(item.genre_ids, genres);
  const Icon = item.type === 'movie' ? Film : Tv;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-200 dark:border-gray-700">
      <div className="relative">
        <div className="w-full h-40 sm:h-48 md:h-64 flex items-center justify-center relative overflow-hidden">
          {item.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${item.poster_path}`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder1.jpg';
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center">
              <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-70" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-4">
            <button
              onClick={() => onDetailsClick(item)}
              className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow"
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Ver detalhes</span>
              <span className="sm:hidden">Ver</span>
            </button>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchlistToggle(item.id);
            }}
            className={`p-1 sm:p-1.5 rounded-full backdrop-blur-sm transition-all ${
              isInWatchlist
                ? 'bg-gray-800/90 dark:bg-gray-600/90 text-white'
                : 'bg-gray-800/60 text-gray-200 hover:bg-gray-700/90 hover:text-white'
            }`}
            aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 ${isInWatchlist ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(item.id);
            }}
            className={`p-1 sm:p-1.5 rounded-full backdrop-blur-sm transition-all ${
              isFavorite
                ? 'bg-gray-800/90 dark:bg-gray-600/90 text-white'
                : 'bg-gray-800/60 text-gray-200 hover:bg-gray-700/90 hover:text-white'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-1 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">{item.overview}</p>
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatYear(releaseDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="hidden sm:inline">{formatDuration(item)}</span>
          </div>
        </div>
        {genreNames && (
          <div className="mb-3">
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{genreNames}</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <StarRating itemId={item.id} rating={rating} onRate={onRate} size="sm" />
          <button
            onClick={() => onDetailsClick(item)}
            className="px-2 sm:px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded-lg text-xs sm:text-sm hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow whitespace-nowrap"
          >
            Detalhes
          </button>
        </div>
      </div>
    </div>
  );
});

ContentCard.displayName = 'ContentCard';

