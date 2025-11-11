import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useGenres = (contentType) => {
  const [genres, setGenres] = useState([]);

  const loadGenres = useCallback(async () => {
    try {
      const data = await apiService.getGenres(contentType);
      setGenres(data);
    } catch (error) {
      console.error('Error loading genres:', error);
      setGenres([]);
    }
  }, [contentType]);

  useEffect(() => {
    loadGenres();
  }, [loadGenres]);

  return genres;
};

