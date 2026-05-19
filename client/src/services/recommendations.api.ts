import { http } from './http';
import { ApiResponse, Movie, RecommendedMovie, RecommendationRequest } from '../types';

// Obtiene géneros disponibles desde el backend
export async function fetchGenres(): Promise<string[]> {
  const res = await http.get<ApiResponse<string[]>>('/genres');
  return res.data || [];
}

// Solicita recomendaciones personalizadas
export async function fetchRecommendations(
  payload: RecommendationRequest
): Promise<RecommendedMovie[]> {
  const res = await http.post<ApiResponse<RecommendedMovie[]>>(
    '/recommendations',
    payload
  );
  return res.data || [];
}

export async function fetchMovieById(id: number): Promise<Movie> {
  const res = await http.get<ApiResponse<Movie>>(`/movies/${id}`);
  return res.data!;
}