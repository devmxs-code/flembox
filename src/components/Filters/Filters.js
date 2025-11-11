import React from 'react';
import { Film, Tv, Filter, Sliders, ChevronDown } from 'lucide-react';
import { CONTENT_TYPES, SORT_OPTIONS } from '../../constants/api';

const SORT_LABELS = {
  [SORT_OPTIONS.POPULARITY]: 'Popularidade',
  [SORT_OPTIONS.RATING]: 'Avaliação',
  [SORT_OPTIONS.NEWEST]: 'Mais recentes',
  [SORT_OPTIONS.OLDEST]: 'Mais antigos',
};

export const Filters = ({
  contentType,
  selectedGenre,
  genres,
  sortBy,
  viewMode,
  onContentTypeChange,
  onGenreChange,
  onSortByChange,
  onViewModeChange,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
          <button
            onClick={() => onContentTypeChange(CONTENT_TYPES.MOVIE)}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              contentType === CONTENT_TYPES.MOVIE
                ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-gray-200'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Film className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Filmes</span>
          </button>
          <button
            onClick={() => onContentTypeChange(CONTENT_TYPES.TV)}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
              contentType === CONTENT_TYPES.TV
                ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-gray-200'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <Tv className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Séries</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative group">
            <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{selectedGenre ? genres.find(g => g.id === selectedGenre)?.name || 'Gênero' : 'Gênero'}</span>
              <span className="sm:hidden">Gênero</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <div className="absolute z-10 right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100">
              <button
                onClick={() => onGenreChange('')}
                className={`w-full text-left px-4 py-2 text-sm ${
                  !selectedGenre
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Todos os gêneros
              </button>
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => onGenreChange(genre.id)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    selectedGenre === genre.id
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <Sliders className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{SORT_LABELS[sortBy]}</span>
              <span className="sm:hidden">Ordenar</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <div className="absolute z-10 right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100">
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => onSortByChange(value)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    sortBy === value
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-gray-200'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-gray-200'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              aria-label="List view"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

