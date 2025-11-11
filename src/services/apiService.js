import { API_KEY, BASE_URL, CONTENT_TYPES } from '../constants/api';

class ApiService {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async fetchData(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }

  async getGenres(contentType) {
    const endpoint = `/genre/${contentType}/list?api_key=${this.apiKey}&language=pt-BR`;
    const data = await this.fetchData(endpoint);
    return data.genres || [];
  }

  async getPopularContent(contentType) {
    const endpoint =
      contentType === CONTENT_TYPES.MOVIE
        ? `/movie/popular?api_key=${this.apiKey}&language=pt-BR&page=1`
        : `/tv/popular?api_key=${this.apiKey}&language=pt-BR&page=1`;
    const data = await this.fetchData(endpoint);
    return this.addContentType(data.results || [], contentType);
  }

  async searchContent(contentType, query) {
    const endpoint =
      contentType === CONTENT_TYPES.MOVIE
        ? `/search/movie?api_key=${this.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`
        : `/search/tv?api_key=${this.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;
    const data = await this.fetchData(endpoint);
    return this.addContentType(data.results || [], contentType);
  }

  async searchContentSuggestions(contentType, query) {
    const endpoint =
      contentType === CONTENT_TYPES.MOVIE
        ? `/search/movie?api_key=${this.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`
        : `/search/tv?api_key=${this.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
    const data = await this.fetchData(endpoint);
    return (data.results || []).slice(0, 5);
  }

  async getContentByGenre(contentType, genreId) {
    const endpoint =
      contentType === CONTENT_TYPES.MOVIE
        ? `/discover/movie?api_key=${this.apiKey}&language=pt-BR&with_genres=${genreId}`
        : `/discover/tv?api_key=${this.apiKey}&language=pt-BR&with_genres=${genreId}`;
    const data = await this.fetchData(endpoint);
    return this.addContentType(data.results || [], contentType);
  }

  addContentType(items, contentType) {
    return items.map(item => ({ ...item, type: contentType }));
  }
}

export default new ApiService(API_KEY, BASE_URL);

