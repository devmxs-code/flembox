import React, { useRef } from 'react';
import { Search, X, Film, Tv } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../constants/api';

export const SearchBar = ({ 
  searchTerm, 
  contentType, 
  searchFocused, 
  showSuggestions, 
  suggestions, 
  onSearchChange, 
  onSearch, 
  onSuggestionClick, 
  onFocus, 
  onBlur 
}) => {
  const searchRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
      searchRef.current?.blur();
    }
  };

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="flex-1 w-full sm:max-w-xl relative">
      <div className={`relative transition-all duration-200 ${searchFocused ? 'ring-2 ring-gray-500 rounded-xl' : 'rounded-full'}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          ref={searchRef}
          type="text"
          placeholder={`Buscar ${contentType === 'movie' ? 'filmes...' : 'séries...'}`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 text-sm sm:text-base border rounded-full focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-9 sm:right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
        <button
          onClick={onSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white p-1 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          aria-label="Search"
        >
          <Search className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-40 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          {suggestions.map(suggestion => {
            const Icon = contentType === 'movie' ? Film : Tv;
            return (
              <div
                key={suggestion.id}
                className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 sm:gap-3"
                onClick={() => onSuggestionClick(suggestion)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="w-10 h-14 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  {suggestion.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${suggestion.poster_path}`}
                      alt={suggestion.title || suggestion.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder1.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm sm:text-base dark:text-white">
                    {suggestion.title || suggestion.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {suggestion.release_date
                      ? new Date(suggestion.release_date).getFullYear()
                      : suggestion.first_air_date
                        ? new Date(suggestion.first_air_date).getFullYear()
                        : 'N/A'}
                    {suggestion.vote_average && ` • ⭐ ${suggestion.vote_average.toFixed(1)}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

