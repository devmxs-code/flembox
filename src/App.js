import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, Star, Heart, Filter, X, Play, Tv, Film, Calendar, Clock, 
  Home, Bookmark, Sliders, ChevronDown, Loader, AlertCircle,
  Moon, Sun, ChevronLeft, ChevronRight
} from 'lucide-react';

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieTVRecommendationSystem = () => {
  const [content, setContent] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [contentType, setContentType] = useState('movie');
  const [sortBy, setSortBy] = useState('popularity');
  const [watchlist, setWatchlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [darkMode, setDarkMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const savedRatings = localStorage.getItem('flemboxRatings');
    if (savedRatings) setRatings(JSON.parse(savedRatings));
    const savedFavorites = localStorage.getItem('flemboxFavorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    const savedWatchlist = localStorage.getItem('flemboxWatchlist');
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    const savedDarkMode = localStorage.getItem('flemboxDarkMode');
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
  }, []);

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem('flemboxRatings', JSON.stringify(ratings));
    localStorage.setItem('flemboxFavorites', JSON.stringify(favorites));
    localStorage.setItem('flemboxWatchlist', JSON.stringify(watchlist));
    localStorage.setItem('flemboxDarkMode', JSON.stringify(darkMode));
  }, [ratings, favorites, watchlist, darkMode]);

  // Carregar gêneros da API
  const loadGenres = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/genre/${contentType}/list?api_key=${API_KEY}&language=pt-BR`);
      const data = await res.json();
      setGenres(data.genres || []);
    } catch {
      setGenres([]);
    }
  }, [contentType]);

  // Carregar conteúdo da API (filmes ou séries populares)
  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        contentType === 'movie'
          ? `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`
          : `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
      const res = await fetch(endpoint);
      const data = await res.json();
      const withType = (data.results || []).map(item => ({
        ...item,
        type: contentType
      }));
      setContent(withType);
    } catch (e) {
      setError('Erro ao carregar conteúdo.');
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [contentType]);

  // Buscar conteúdo (filme ou série)
  const searchContent = useCallback(async (query) => {
    if (!query) {
      loadContent();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        contentType === 'movie'
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`
          : `${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      const withType = (data.results || []).map(item => ({
        ...item,
        type: contentType
      }));
      setContent(withType);
    } catch (e) {
      setError('Erro ao buscar conteúdo.');
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [contentType, loadContent]);

  // Buscar sugestões de pesquisa
  const fetchSearchSuggestions = useCallback(async (query) => {
    if (!query) {
      setSearchSuggestions([]);
      return;
    }
    try {
      const endpoint =
        contentType === 'movie'
          ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`
          : `${BASE_URL}/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setSearchSuggestions(data.results?.slice(0, 5) || []);
    } catch {
      setSearchSuggestions([]);
    }
  }, [contentType]);

  // Filtrar por gênero
  const filterByGenre = useCallback(async (genreId) => {
    if (!genreId) {
      loadContent();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        contentType === 'movie'
          ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}`
          : `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      const withType = (data.results || []).map(item => ({
        ...item,
        type: contentType
      }));
      setContent(withType);
    } catch (e) {
      setError('Erro ao filtrar por gênero.');
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [contentType, loadContent]);

  // Efeitos para carregar dados ao trocar tipo
  useEffect(() => {
    loadGenres();
    loadContent();
  }, [contentType, loadGenres, loadContent]);

  // Efeito para buscar sugestões quando o termo de pesquisa muda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchSearchSuggestions(searchTerm);
      } else {
        setSearchSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchSearchSuggestions]);

  // Gerenciar favoritos
  const toggleFavorite = useCallback((itemId) => {
    setFavorites(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  // Gerenciar watchlist
  const toggleWatchlist = useCallback((itemId) => {
    setWatchlist(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  // Avaliar conteúdo
  const rateContent = useCallback((itemId, rating) => {
    setRatings(prev => ({ ...prev, [itemId]: rating }));
  }, []);

  // Ordenar conteúdo conforme sortBy
  const sortContent = useCallback((items) => {
    let sorted = [...items];
    if (sortBy === 'popularity') {
      sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || 0);
        const dateB = new Date(b.release_date || b.first_air_date || 0);
        return dateB - dateA;
      });
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || 0);
        const dateB = new Date(b.release_date || b.first_air_date || 0);
        return dateA - dateB;
      });
    }
    return sorted;
  }, [sortBy]);

  // Handlers
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      searchContent(searchTerm);
      setShowSuggestions(false);
      searchRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title || suggestion.name);
    setContent([{ ...suggestion, type: contentType }]);
    setShowSuggestions(false);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    filterByGenre(genreId);
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
    setSearchTerm('');
    setSelectedGenre('');
    setSearchSuggestions([]);
  };

  // Componente de avaliação por estrelas
  const StarRating = React.memo(({ itemId, size = 'md' }) => {
    const currentRating = ratings[itemId] || 0;
    const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={e => {
              e.stopPropagation();
              rateContent(itemId, star);
            }}
          >
            <Star
              className={`${sizes[size]} transition-colors ${
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

  // Componente de card de conteúdo
  const ContentCard = React.memo(({ item }) => {
    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;
    const genreNames = item.genre_ids
      ?.map(id => genres.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const formatDuration = (item) => {
      if (item.type === 'movie') {
        if (!item.runtime) return '';
        return `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}min`;
      } else {
        const avgRuntime = item.episode_run_time?.[0] || 45;
        return `${item.number_of_seasons || 1} temporada${(item.number_of_seasons || 1) > 1 ? 's' : ''} • ${avgRuntime}min/ep`;
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="w-full h-40 sm:h-48 md:h-64 flex items-center justify-center relative overflow-hidden">
            {item.poster_path ? (
              <img
                src={
                  item.poster_path.startsWith('/placeholder')
                    ? item.poster_path
                    : `${IMAGE_BASE_URL}${item.poster_path}`
                }
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder1.jpg';
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center">
                {item.type === 'movie' ? (
                  <Film className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-70" />
                ) : (
                  <Tv className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-70" />
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-4">
              <button
                onClick={() => setSelectedContent(item)}
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
                toggleWatchlist(item.id);
              }}
              className={`p-1 sm:p-1.5 rounded-full backdrop-blur-sm transition-all ${
                watchlist.includes(item.id) 
                  ? 'bg-gray-800/90 dark:bg-gray-600/90 text-white' 
                  : 'bg-gray-800/60 text-gray-200 hover:bg-gray-700/90 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 ${watchlist.includes(item.id) ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
              }}
              className={`p-1 sm:p-1.5 rounded-full backdrop-blur-sm transition-all ${
                favorites.includes(item.id) 
                  ? 'bg-gray-800/90 dark:bg-gray-600/90 text-white' 
                  : 'bg-gray-800/60 text-gray-200 hover:bg-gray-700/90 hover:text-white'
              }`}
            >
              <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-1 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 line-clamp-2">{item.overview}</p>
          <div className="flex items-center justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
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
            <StarRating itemId={item.id} size="sm" />
            <button
              onClick={() => setSelectedContent(item)}
              className="px-2 sm:px-3 py-1 bg-gray-800 dark:bg-gray-700 text-white rounded-lg text-xs sm:text-sm hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow whitespace-nowrap"
            >
              Detalhes
            </button>
          </div>
        </div>
      </div>
    );
  });

  // Componente de item de lista
  const ContentListItem = React.memo(({ item }) => {
    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;
    const genreNames = item.genre_ids
      ?.map(id => genres.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const formatDuration = (item) => {
      if (item.type === 'movie') {
        if (!item.runtime) return '';
        return `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}min`;
      } else {
        const avgRuntime = item.episode_run_time?.[0] || 45;
        return `${item.number_of_seasons || 1} temporada${(item.number_of_seasons || 1) > 1 ? 's' : ''} • ${avgRuntime}min/ep`;
      }
    };

    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex border border-gray-200 dark:border-gray-700 cursor-pointer"
        onClick={() => setSelectedContent(item)}
      >
        <div className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 flex-shrink-0 relative">
          {item.poster_path ? (
            <img 
              src={
                item.poster_path.startsWith('/placeholder')
                  ? item.poster_path
                  : `${IMAGE_BASE_URL}${item.poster_path}`
              }
              alt={title}
              className="w-full h-full object-cover"
              onError={e => {
                e.target.onerror = null;
                e.target.src = '/placeholder1.jpg';
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center">
              {item.type === 'movie' ? (
                <Film className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-70" />
              ) : (
                <Tv className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-70" />
              )}
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
                  toggleWatchlist(item.id);
                }}
                className={`p-1 rounded-full transition-colors ${
                  watchlist.includes(item.id) 
                    ? 'text-gray-800 dark:text-gray-200' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${watchlist.includes(item.id) ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
                className={`p-1 rounded-full transition-colors ${
                  favorites.includes(item.id) 
                    ? 'text-gray-800 dark:text-gray-200' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-wrap">
            <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
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

  // Modal de detalhes
  const ContentModal = ({ item, onClose }) => {
    if (!item) return null;

    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;
    const genreNames = item.genre_ids
      ?.map(id => genres.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const formatDuration = (item) => {
      if (item.type === 'movie') {
        if (!item.runtime) return '';
        return `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}min`;
      } else {
        const avgRuntime = item.episode_run_time?.[0] || 45;
        return `${item.number_of_seasons || 1} temporada${(item.number_of_seasons || 1) > 1 ? 's' : ''} • ${avgRuntime}min/ep`;
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl sm:max-w-4xl max-h-[95vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
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
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder1.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {item.type === 'movie' ? (
                    <Film className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-70" />
                  ) : (
                    <Tv className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-70" />
                  )}
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
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder1.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center">
                      {item.type === 'movie' ? (
                        <Film className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      ) : (
                        <Tv className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white line-clamp-2">{title}</h2>
                  <div className="flex items-center gap-2 sm:gap-4 text-white mt-2 flex-wrap text-xs sm:text-sm">
                    <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-gray-300 text-gray-300" />
                      <span>{item.vote_average?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{formatDuration(item)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StarRating itemId={item.id} size="sm" />
                    {ratings[item.id] && (
                      <span className="text-xs sm:text-sm text-gray-300 font-semibold">
                        Sua avaliação: {ratings[item.id]} estrela{ratings[item.id] > 1 ? 's' : ''}
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
                      onClick={() => toggleWatchlist(item.id)}
                      className={`p-2 rounded-full transition-colors ${
                        watchlist.includes(item.id) 
                          ? 'bg-gray-800 dark:bg-gray-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${watchlist.includes(item.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-2 rounded-full transition-colors ${
                        favorites.includes(item.id) 
                          ? 'bg-gray-800 dark:bg-gray-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
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
                    <p className="text-sm sm:text-base font-medium dark:text-white">
                      {releaseDate
                        ? new Date(releaseDate).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                      {item.type === 'movie' ? 'Duração' : 'Duração por episódio'}
                    </h4>
                    <p className="text-sm sm:text-base font-medium dark:text-white">
                      {item.type === 'movie' 
                        ? (item.runtime ? `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}min` : 'N/A')
                        : `${item.episode_run_time?.[0] || 45} minutos`
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:w-64 flex-shrink-0">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                  <h3 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base dark:text-white">Avalie este {item.type === 'movie' ? 'filme' : 'série'}</h3>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <StarRating itemId={item.id} size="md" />
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

  // Obter conteúdo atual baseado na aba ativa e ordenação
  const getCurrentContent = () => {
    let filtered = content;
    if (activeTab === 'favorites') {
      filtered = content.filter(item => favorites.includes(item.id));
    } else if (activeTab === 'watchlist') {
      filtered = content.filter(item => watchlist.includes(item.id));
    }
    return sortContent(filtered);
  };

  // Renderização principal
  return (
    <div className="min-h-[100dvh] flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <Film className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800 dark:text-gray-200" />
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">FlemBox</h1>
              </div>
              {/* Botão de tema */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors sm:hidden"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Barra de pesquisa aprimorada */}
            <div className="flex-1 w-full sm:max-w-xl relative order-3 sm:order-2">
              <div className={`relative transition-all duration-200 ${searchFocused ? 'ring-2 ring-gray-500 rounded-xl' : 'rounded-full'}`}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={`Buscar ${contentType === 'movie' ? 'filmes...' : 'séries...'}`}
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyPress={handleSearch}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                    setSearchFocused(false);
                  }}
                  className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 text-sm sm:text-base border rounded-full focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSearchSuggestions([]);
                      loadContent();
                    }}
                    className="absolute right-9 sm:right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 dark:bg-gray-700 text-white p-1 rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              
              {/* Sugestões de pesquisa */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-40 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  {searchSuggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 sm:gap-3"
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseDown={(e) => e.preventDefault()} // Previne o blur do input
                    >
                      <div className="w-10 h-14 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                        {suggestion.poster_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${suggestion.poster_path}`}
                            alt={suggestion.title || suggestion.name}
                            className="w-full h-full object-cover"
                            onError={e => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder1.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center">
                            {contentType === 'movie' ? (
                              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                              <Tv className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            )}
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
                  ))}
                </div>
              )}
            </div>

            {/* Botão de tema - desktop */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors hidden sm:block order-2 sm:order-3"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Abas de navegação */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide -mb-px">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-3 sm:px-4 py-2 rounded-t-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'discover'
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
              onClick={() => setActiveTab('favorites')}
              className={`px-3 sm:px-4 py-2 rounded-t-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-gray-800 dark:bg-gray-700 text-white border-b-2 border-gray-800 dark:border-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Favoritos ({favorites.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 sm:px-4 py-2 rounded-t-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === 'watchlist'
                  ? 'bg-gray-800 dark:bg-gray-700 text-white border-b-2 border-gray-800 dark:border-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Assistir depois ({watchlist.length})</span>
                <span className="sm:hidden">Lista ({watchlist.length})</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Filtros e controles */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          {/* Toggle Filmes/Séries */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => handleContentTypeChange('movie')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                contentType === 'movie'
                  ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-gray-200'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Film className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Filmes</span>
            </button>
            <button
              onClick={() => handleContentTypeChange('tv')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                contentType === 'tv'
                  ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-gray-200'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Tv className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Séries</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro por gênero */}
            <div className="relative group">
              <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{selectedGenre ? genres.find(g => g.id === selectedGenre)?.name || 'Gênero' : 'Gênero'}</span>
                <span className="sm:hidden">Gênero</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <div className="absolute z-10 right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100">
                <button
                  onClick={() => handleGenreChange('')}
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
                    onClick={() => handleGenreChange(genre.id)}
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

            {/* Ordenação */}
            <div className="relative group">
              <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-xs sm:text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <Sliders className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">
                  {sortBy === 'popularity' && 'Popularidade'}
                  {sortBy === 'rating' && 'Avaliação'}
                  {sortBy === 'newest' && 'Mais recentes'}
                  {sortBy === 'oldest' && 'Mais antigos'}
                </span>
                <span className="sm:hidden">Ordenar</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <div className="absolute z-10 right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 group-hover:scale-100">
                <button
                  onClick={() => setSortBy('popularity')}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    sortBy === 'popularity'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Popularidade
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    sortBy === 'rating'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Avaliação
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    sortBy === 'newest'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Mais recentes
                </button>
                <button
                  onClick={() => setSortBy('oldest')}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    sortBy === 'oldest'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Mais antigos
                </button>
              </div>
            </div>

            {/* Visualização (grid/lista) */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
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
        ) : getCurrentContent().length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Film className="w-12 h-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {activeTab === 'favorites'
                ? 'Nenhum favorito adicionado ainda.'
                : activeTab === 'watchlist'
                  ? 'Sua lista para assistir está vazia.'
                  : 'Nenhum resultado encontrado.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {getCurrentContent().map(item => (
              <ContentCard key={`${item.id}-${item.type}`} item={item} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {getCurrentContent().map(item => (
              <ContentListItem key={`${item.id}-${item.type}`} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Modal de detalhes */}
      {selectedContent && (
        <ContentModal
          item={selectedContent}
          onClose={() => setSelectedContent(null)}
        />
      )}
    </div>
  );
};

export default MovieTVRecommendationSystem;