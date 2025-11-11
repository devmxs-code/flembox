import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useSearchSuggestions = (contentType, searchTerm) => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await apiService.searchContentSuggestions(contentType, query);
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  }, [contentType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchSuggestions]);

  return suggestions;
};

