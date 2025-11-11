export const formatDuration = (item) => {
  if (item.type === 'movie') {
    if (!item.runtime) return '';
    return `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}min`;
  } else {
    const avgRuntime = item.episode_run_time?.[0] || 45;
    const seasons = item.number_of_seasons || 1;
    return `${seasons} temporada${seasons > 1 ? 's' : ''} • ${avgRuntime}min/ep`;
  }
};

export const formatReleaseDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatYear = (date) => {
  if (!date) return 'N/A';
  return new Date(date).getFullYear();
};

export const getGenreNames = (genreIds, genres) => {
  if (!genreIds || !genres) return '';
  return genreIds
    .map(id => genres.find(g => g.id === id)?.name)
    .filter(Boolean)
    .join(', ');
};

export const getContentTitle = (item) => {
  return item.title || item.name || 'Sem título';
};

export const getContentReleaseDate = (item) => {
  return item.release_date || item.first_air_date;
};

