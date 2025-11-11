import React from 'react';
import { X, Play, Bookmark, Heart, Star, Film, Tv } from 'lucide-react';
import { StarRating } from '../StarRating/StarRating';
import { IMAGE_BASE_URL } from '../../constants/api';
import { formatDuration, formatReleaseDate, formatYear, getGenreNames, getContentTitle, getContentReleaseDate } from '../../utils/formatters';

export const ContentModal = ({ item, genres, rating, isFavorite, isInWatchlist, onClose, onFavoriteToggle, onWatchlistToggle, onRate }) => {
  if (!item) return null;

  const title = getContentTitle(item);
  const releaseDate = getContentReleaseDate(item);
  const genreNames = getGenreNames(item.genre_ids, genres);
  const Icon = item.type === 'movie' ? Film : Tv;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl sm:max-w-4xl max-h-[95vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-800 dark:text-white" />
        </button>
        <div className="relative h-48 sm:h-64 w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center">
            {item.backdrop_path ? (
              <img
                src={`${IMAGE_BASE_URL}${item.backdrop_path}`}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder1.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-70" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
            <div className="flex items-end gap-2 sm:gap-4">
              <div className="w-16 h-24 sm:w-24 sm:h-36 bg-white dark:bg-gray-700 rounded-lg shadow-md flex-shrink-0 relative overflow-hidden">
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
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white line-clamp-2">{title}</h2>
                <div className="flex items-center gap-2 sm:gap-4 text-white mt-2 flex-wrap text-xs sm:text-sm">
                  <span>{formatYear(releaseDate)}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-gray-300 text-gray-300" />
                    <span>{item.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{formatDuration(item)}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StarRating itemId={item.id} rating={rating} onRate={onRate} size="sm" />
                  {rating && (
                    <span className="text-xs sm:text-sm text-gray-300 font-semibold">
                      Sua avaliação: {rating} estrela{rating > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <button className="px-4 sm:px-6 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm sm:text-base">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{item.type === 'movie' ? 'Assistir Trailer' : 'Ver Trailer'}</span>
                  <span className="sm:hidden">Trailer</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onWatchlistToggle(item.id)}
                    className={`p-2 rounded-full transition-colors ${
                      isInWatchlist
                        ? 'bg-gray-800 dark:bg-gray-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-600 hover:text-white'
                    }`}
                    aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => onFavoriteToggle(item.id)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite
                        ? 'bg-gray-800 dark:bg-gray-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-600 hover:text-white'
                    }`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 dark:text-white">Sinopse</h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">{item.overview || 'Sinopse não disponível.'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Tipo</h4>
                  <p className="text-sm sm:text-base font-medium dark:text-white">{item.type === 'movie' ? 'Filme' : 'Série'}</p>
                </div>
                {genreNames && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Gêneros</h4>
                    <p className="text-sm sm:text-base font-medium dark:text-white">{genreNames}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    {item.type === 'movie' ? 'Data de Lançamento' : 'Estreia'}
                  </h4>
                  <p className="text-sm sm:text-base font-medium dark:text-white">{formatReleaseDate(releaseDate)}</p>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    {item.type === 'movie' ? 'Duração' : 'Duração por episódio'}
                  </h4>
                  <p className="text-sm sm:text-base font-medium dark:text-white">
                    {item.type === 'movie'
                      ? (item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}min` : 'N/A')
                      : `${item.episode_run_time?.[0] || 45} minutos`}
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-64 flex-shrink-0">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                <h3 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base dark:text-white">Avalie este {item.type === 'movie' ? 'filme' : 'série'}</h3>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <StarRating itemId={item.id} rating={rating} onRate={onRate} size="md" />
                </div>
                <div className="mt-4 sm:mt-6">
                  <h3 className="font-bold mb-2 text-sm sm:text-base dark:text-white">Estatísticas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Popularidade</span>
                      <span className="font-medium dark:text-white">{item.popularity?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Avaliação média</span>
                      <span className="font-medium dark:text-white">{item.vote_average?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Total de votos</span>
                      <span className="font-medium dark:text-white">{item.vote_count || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

