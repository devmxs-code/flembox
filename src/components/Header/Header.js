import React from 'react';
import { Home, Heart, Bookmark, Moon, Sun } from 'lucide-react';
import { SearchBar } from '../SearchBar/SearchBar';
import { Logo } from '../Logo/Logo';
import { TABS } from '../../constants/api';

export const Header = ({
  darkMode,
  contentType,
  searchTerm,
  searchFocused,
  showSuggestions,
  searchSuggestions,
  favoritesCount,
  watchlistCount,
  activeTab,
  onDarkModeToggle,
  onSearchChange,
  onSearch,
  onSuggestionClick,
  onSearchFocus,
  onSearchBlur,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 sm:w-8 sm:h-8" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">FlemBox</h1>
            </div>
            <button
              onClick={onDarkModeToggle}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors sm:hidden"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            contentType={contentType}
            searchFocused={searchFocused}
            showSuggestions={showSuggestions}
            suggestions={searchSuggestions}
            onSearchChange={onSearchChange}
            onSearch={onSearch}
            onSuggestionClick={onSuggestionClick}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
          />

          <button
            onClick={onDarkModeToggle}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hidden sm:block"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide -mb-px">
          <button
            onClick={() => onTabChange(TABS.DISCOVER)}
            className={`px-3 sm:px-4 py-2 rounded-t-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeTab === TABS.DISCOVER
                ? 'bg-gray-800 dark:bg-gray-700 text-white border-b-2 border-gray-800 dark:border-gray-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Descobrir</span>
            </div>
          </button>
          <button
            onClick={() => onTabChange(TABS.FAVORITES)}
            className={`px-3 sm:px-4 py-2 rounded-t-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeTab === TABS.FAVORITES
                ? 'bg-gray-800 dark:bg-gray-700 text-white border-b-2 border-gray-800 dark:border-gray-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Favoritos ({favoritesCount})</span>
            </div>
          </button>
          <button
            onClick={() => onTabChange(TABS.WATCHLIST)}
            className={`px-3 sm:px-4 py-2 rounded-t-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
              activeTab === TABS.WATCHLIST
                ? 'bg-gray-800 dark:bg-gray-700 text-white border-b-2 border-gray-800 dark:border-gray-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Assistir depois ({watchlistCount})</span>
              <span className="sm:hidden">Lista ({watchlistCount})</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

