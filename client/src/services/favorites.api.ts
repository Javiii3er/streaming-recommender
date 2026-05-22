import { http } from './http';
import { ApiResponse } from '../types';

export interface FavoriteMovie {
  id: number;
  movie_id: number;
  title: string;
  genres: string;
  year: number | null;
  image_url: string | null;
  description: string | null;
  created_at: string;
}

// Agregar a favoritos
export async function addToFavorites(
  userId: number,
  movie: {
    id: number;
    title: string;
    genres: string;
    year: number | null;
    image_url: string | null;
    description: string | null;
  }
): Promise<void> {
  await http.post('/favorites', {
    userId,
    movieId: movie.id,
    title: movie.title,
    genres: movie.genres,
    year: movie.year,
    image_url: movie.image_url,
    description: movie.description,
  });
}

// Eliminar de favoritos
export async function removeFromFavorites(
  userId: number,
  movieId: number
): Promise<void> {
  await http.post('/favorites/remove', { userId, movieId });
}

// Obtener favoritos
export async function fetchFavorites(userId: number): Promise<FavoriteMovie[]> {
  const res = await http.get<ApiResponse<FavoriteMovie[]>>(`/favorites/${userId}`);
  return res.data || [];
}

// Verificar si es favorito
export async function checkIsFavorite(
  userId: number,
  movieId: number
): Promise<boolean> {
  const res = await http.get<ApiResponse<{ isFavorite: boolean }>>(
    `/favorites/check/${userId}/${movieId}`
  );
  return res.data?.isFavorite || false;
}

// Recomendaciones basadas en favoritos
export async function fetchFavoriteRecommendations(userId: number): Promise<any[]> {
  const res = await http.post<ApiResponse<any[]>>('/favorites/recommendations', { userId });
  return res.data || [];
}