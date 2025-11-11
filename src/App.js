import React, { useState, useCallback, useEffect } from 'react';
import { Loader, AlertCircle, Film } from 'lucide-react';
import { Header } from './components/Header/Header';
import { Filters } from './components/Filters/Filters';
import { ContentCard } from './components/ContentCard/ContentCard';
import { ContentListItem } from './components/ContentListItem/ContentListItem';
import { ContentModal } from './components/ContentModal/ContentModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useContent } from './hooks/useContent';
import { useGenres } from './hooks/useGenres';
import { useSearchSuggestions } from './hooks/useSearchSuggestions';
import { useDarkMode } from './hooks/useDarkMode';
import { sortContent } from './utils/sorters';
import { CONTENT_TYPES, TABS, SORT_OPTIONS, VIEW_MODES, STORAGE_KEYS } from './constants/api';

const App = () => {
  const [contentType, setContentType] = useState(CONTENT_TYPES.MOVIE);
  const [activeTab, setActiveTab] = useState(TABS.DISCOVER);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.POPULARITY);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const [darkMode, setDarkMode] = useLocalStorage(STORAGE_KEYS.DARK_MODE, false);
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);
  const [watchlist, setWatchlist] = useLocalStorage(STORAGE_KEYS.WATCHLIST, []);
  const [ratings, setRatings] = useLocalStorage(STORAGE_KEYS.RATINGS, {});

  const { content, loading, error, loadContent, searchContent, filterByGenre } = useContent(contentType);
  const genres = useGenres(contentType);
  const searchSuggestions = useSearchSuggestions(contentType, searchTerm);

  useDarkMode(darkMode);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleContentTypeChange = useCallback((type) => {
    setContentType(type);
    setSearchTerm('');
    setSelectedGenre('');
    setShowSuggestions(false);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      searchContent(searchTerm);
    } else {
      loadContent();
    }
    setShowSuggestions(false);
  }, [searchTerm, searchContent, loadContent]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setShowSuggestions(true);
    if (!value) {
      loadContent();
      setShowSuggestions(false);
    }
  }, [loadContent]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchTerm(suggestion.title || suggestion.name);
    searchContent(suggestion.title || suggestion.name);
    setShowSuggestions(false);
  }, [contentType, searchContent]);

  const handleGenreChange = useCallback((genreId) => {
    setSelectedGenre(genreId);
    filterByGenre(genreId);
  }, [filterByGenre]);

  const toggleFavorite = useCallback((itemId) => {
    setFavorites(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, [setFavorites]);

  const toggleWatchlist = useCallback((itemId) => {
    setWatchlist(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, [setWatchlist]);

  const rateContent = useCallback((itemId, rating) => {
    setRatings(prev => ({ ...prev, [itemId]: rating }));
  }, [setRatings]);

  const getCurrentContent = useCallback(() => {
    let filtered = content;
    if (activeTab === TABS.FAVORITES) {
      filtered = content.filter(item => favorites.includes(item.id));
    } else if (activeTab === TABS.WATCHLIST) {
      filtered = content.filter(item => watchlist.includes(item.id));
    }
    return sortContent(filtered, sortBy);
  }, [content, activeTab, favorites, watchlist, sortBy]);

  const currentContent = getCurrentContent();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      <Header
        darkMode={darkMode}
        contentType={contentType}
        searchTerm={searchTerm}
        searchFocused={searchFocused}
        showSuggestions={showSuggestions}
        searchSuggestions={searchSuggestions}
        favoritesCount={favorites.length}
        watchlistCount={watchlist.length}
        activeTab={activeTab}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onSuggestionClick={handleSuggestionClick}
        onSearchFocus={() => setSearchFocused(true)}
        onSearchBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200);
          setSearchFocused(false);
        }}
        onTabChange={setActiveTab}
      />

      <Filters
        contentType={contentType}
        selectedGenre={selectedGenre}
        genres={genres}
        sortBy={sortBy}
        viewMode={viewMode}
        onContentTypeChange={handleContentTypeChange}
        onGenreChange={handleGenreChange}
        onSortByChange={setSortBy}
        onViewModeChange={setViewMode}
      />

      <main className="flex-1 max-w-7xl mx-auto px-2 sm:px-4 py-2 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-12 h-12 animate-spin text-gray-600 dark:text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-gray-600 dark:text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={loadContent}
              className="mt-4 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : currentContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Film className="w-12 h-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {activeTab === TABS.FAVORITES
                ? 'Nenhum favorito adicionado ainda.'
                : activeTab === TABS.WATCHLIST
                  ? 'Sua lista para assistir está vazia.'
                  : 'Nenhum resultado encontrado.'}
            </p>
          </div>
        ) : viewMode === VIEW_MODES.GRID ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {currentContent.map(item => (
              <ContentCard
                key={`${item.id}-${item.type}`}
                item={item}
                genres={genres}
                rating={ratings[item.id]}
                isFavorite={favorites.includes(item.id)}
                isInWatchlist={watchlist.includes(item.id)}
                onFavoriteToggle={toggleFavorite}
                onWatchlistToggle={toggleWatchlist}
                onRate={rateContent}
                onDetailsClick={setSelectedContent}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {currentContent.map(item => (
              <ContentListItem
                key={`${item.id}-${item.type}`}
                item={item}
                genres={genres}
                isFavorite={favorites.includes(item.id)}
                isInWatchlist={watchlist.includes(item.id)}
                onFavoriteToggle={toggleFavorite}
                onWatchlistToggle={toggleWatchlist}
                onDetailsClick={setSelectedContent}
              />
            ))}
          </div>
        )}
      </main>

      {selectedContent && (
        <ContentModal
          item={selectedContent}
          genres={genres}
          rating={ratings[selectedContent.id]}
          isFavorite={favorites.includes(selectedContent.id)}
          isInWatchlist={watchlist.includes(selectedContent.id)}
          onClose={() => setSelectedContent(null)}
          onFavoriteToggle={toggleFavorite}
          onWatchlistToggle={toggleWatchlist}
          onRate={rateContent}
        />
      )}
    </div>
  );
};

export default App;
