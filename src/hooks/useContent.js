import { useState, useCallback } from 'react';
import apiService from '../services/apiService';

export const useContent = (contentType) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getPopularContent(contentType);
      setContent(data);
    } catch (err) {
      setError('Erro ao carregar conteúdo.');
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [contentType]);

  const searchContent = useCallback(async (query) => {
    if (!query) {
      await loadContent();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.searchContent(contentType, query);
      setContent(data);
    } catch (err) {
      setError('Erro ao buscar conteúdo.');
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [contentType, loadContent]);

  const filterByGenre = useCallback(async (genreId) => {
    if (!genreId) {
      await loadContent();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getContentByGenre(contentType, genreId);
      setContent(data);
    } catch (err) {
      setError('Erro ao filtrar por gênero.');
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [contentType, loadContent]);

  return {
    content,
    loading,
    error,
    loadContent,
    searchContent,
    filterByGenre,
  };
};

