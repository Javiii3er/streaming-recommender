import { env } from '../config/env';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

interface TMDBResponse {
  results: {
    poster_path: string | null;
    overview: string;
  }[];
}

export async function fetchMovieFromTMDB(
  title: string,
  year: number | null
): Promise<{ image_url: string | null; description: string | null }> {
  if (!env.tmdbKey) return { image_url: null, description: null };

  try {
    const query = encodeURIComponent(title);
    const yearParam = year ? `&year=${year}` : '';
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${env.tmdbKey}&query=${query}${yearParam}&language=es-ES`;

    const response = await fetch(url);
    const data = await response.json() as TMDBResponse;

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      return {
        image_url: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : null,
        description: movie.overview || null,
      };
    }
    return { image_url: null, description: null };
  } catch (error) {
    console.error(`Error al buscar "${title}" en TMDB:`, error);
    return { image_url: null, description: null };
  }
}