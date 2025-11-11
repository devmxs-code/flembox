import { SORT_OPTIONS } from '../constants/api';

export const sortContent = (items, sortBy) => {
  const sorted = [...items];

  switch (sortBy) {
    case SORT_OPTIONS.POPULARITY:
      return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    case SORT_OPTIONS.RATING:
      return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));

    case SORT_OPTIONS.NEWEST:
      return sorted.sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || 0);
        const dateB = new Date(b.release_date || b.first_air_date || 0);
        return dateB - dateA;
      });

    case SORT_OPTIONS.OLDEST:
      return sorted.sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || 0);
        const dateB = new Date(b.release_date || b.first_air_date || 0);
        return dateA - dateB;
      });

    default:
      return sorted;
  }
};

